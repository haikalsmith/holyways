package handlers

import (
	"fmt"
	funderdto "holyways/dto/funder"
	dto "holyways/dto/result"
	"holyways/models"
	"holyways/repositories"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
	"gopkg.in/gomail.v2"
)

type handlerFunder struct {
	FunderRepository repositories.FunderRepository
}

func HandlerFunder(DonaturRepository repositories.FunderRepository) *handlerFunder {
	return &handlerFunder{DonaturRepository}
}

func (h *handlerFunder) FindFunder(c echo.Context) error {
	funders, err := h.FunderRepository.FindFunder()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Data: funders})
}

func (h *handlerFunder) FindFunderByLogin(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	funders, err := h.FunderRepository.FindFunderByLogin(int(userId))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Data: funders})
}

func (h *handlerFunder) FindFunderByDonationIDAndStatusPending(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	funder, err := h.FunderRepository.FindFunderByDonationIDAndStatusPending(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Data: funder})
}

func (h *handlerFunder) FindFunderByDonationIDAndStatusSucces(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	funder, err := h.FunderRepository.FindFunderByDonationIDAndStatusSucces(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Data: funder})
}

func (h *handlerFunder) GetFunder(c echo.Context) error {

	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	funder, err := h.FunderRepository.GetFunder(int(userId))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Data: funder})
}

func (h *handlerFunder) CreateFunder(c echo.Context) error {
	request := new(funderdto.FunderRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)
	donationTime := time.Now().Format("Monday 02 January 2006")

	// create transaction unique
	var transactionIsMatch = false
	var funderId int
	for !transactionIsMatch {
		funderId = int(time.Now().Unix())
		transactionData, _ := h.FunderRepository.GetFunder(funderId)
		if transactionData.ID == 0 {
			transactionIsMatch = true
		}
	}

	// data form pattern submit to pattern entity db user
	funder := models.Funder{
		ID:         funderId,
		CreatedAt:  donationTime,
		Total:      request.Total,
		Status:     "pending",
		UserID:     int(userId),
		DonationID: request.DonationID,
	}

	dataTransaction, err := h.FunderRepository.CreateFunder(funder)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	// 1. Initiate Snap client
	var s = snap.Client{}
	s.New(os.Getenv("SERVER_KEY"), midtrans.Sandbox)

	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  strconv.Itoa(dataTransaction.ID),
			GrossAmt: int64(dataTransaction.Total),
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: dataTransaction.User.FullName,
			Email: dataTransaction.User.Email,
		},
	}

	snapResp, _ := s.CreateTransaction(req)
	fmt.Println("INI SNAPRESP : ", snapResp)
	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Data: snapResp})

}

func (h *handlerFunder) Notification(c echo.Context) error {
	var notificationPayload map[string]interface{}

	if err := c.Bind(&notificationPayload); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}
	transactionStatus := notificationPayload["transaction_status"].(string)
	fraudStatus := notificationPayload["fraud_status"].(string)
	orderId := notificationPayload["order_id"].(string)

	order_id, _ := strconv.Atoi(orderId)

	transaction, _ := h.FunderRepository.GetFunderID(order_id)

	if transactionStatus == "capture" {
		if fraudStatus == "challenge" {
			SendMail("success", transaction)
			h.FunderRepository.UpdateFunder("pending", order_id)
		} else if fraudStatus == "accept" {
			SendMail("success", transaction)
			_, err := h.FunderRepository.UpdateFunder("success", order_id)
			if err != nil {
				fmt.Println(err)
			}
		}
	} else if transactionStatus == "settlement" {
		SendMail("success", transaction)
		h.FunderRepository.UpdateFunder("success", order_id)
	} else if transactionStatus == "deny" {
		h.FunderRepository.UpdateFunder("failed", order_id)
	} else if transactionStatus == "cancel" || transactionStatus == "expire" {
		h.FunderRepository.UpdateFunder("failed", order_id)
	} else if transactionStatus == "pending" {
		h.FunderRepository.UpdateFunder("pending", order_id)
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Data: notificationPayload})
}

func SendMail(status string, funder models.Funder) {
	if status != funder.Status && (status == "success") {
		var CONFIG_SMTP_HOST = "smtp.gmail.com"
		var CONFIG_SMTP_PORT = 587
		var CONFIG_SENDER_NAME = "HolyWays <rahmanmuhaemin@gmail.com>"
		var CONFIG_AUTH_EMAIL = os.Getenv("EMAIL_SYSTEM")
		var CONFIG_AUTH_PASSWORD = os.Getenv("PASSWORD_SYSTEM")

		title := funder.Donation.Title
		total := strconv.Itoa(funder.Total)
		customer := funder.User.Email
		order_number := funder.ID
		invoice_date := funder.CreatedAt
		payment_method := "VISA"
		currency := "IDR"
		// thumbnail := funder.Donation.Thumbnail
		// price := strconv.Itoa(funder.Total)

		mailer := gomail.NewMessage()
		mailer.SetHeader("From", CONFIG_SENDER_NAME)
		mailer.SetHeader("To", funder.User.Email)
		mailer.SetHeader("Subject", "Donation Status")
		mailer.SetBody("text/html", fmt.Sprintf(`
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Succes</title>
				<style>
					body {
						font-family: Arial, Helvetica, sans-serif;
					}
					.container {
						background-color: rgb(234, 232, 232);
						width: 400px; 
						border-radius: 20px;
						overflow: hidden;
					}
					h1 {
						text-align: center;
					}
					img {
						width: 150px;
						margin: 0 auto;

					}
					.zz {
						display: flex;
						flex-direction: column;
						justify-content: center;
					}
					.zzz {
						display: flex;
						justify-content: space-between;
						border-bottom: 1px solid rgb(199, 194, 194);
						padding: 5px
					}
					h4.title {
						width: 200px;
						font-weight: normal;
						margin: 0;
					}
					h4.isi {
						width: 200px;
						font-weight: normal;
						margin: 0;
					}
				</style>
			</head>
			<body>
				<div class="container">
					<div class="zz">
						<h1>Holyways</h1>
						<img src="https://dmbala.stripocdn.email/content/guids/CABINET_c0e87147643dfd412738cb6184109942/images/151618429860259.png" alt="" />
						<h1>Terimakasih Donasinya Orang Baik!</h1>
					</div>
					<div style="padding: 15px">
						<div class="zzz">
							<h4 class="title">Title</h4>
							<h4 class="isi">: %s</h4>
						</div>
						<div class="zzz">
							<h4 class="title">Total</h4>
							<h4 class="isi">: %s</h4>
						</div>
						<div class="zzz">
							<h4 class="title">Customer</h4>
							<h4 class="isi">: %s</h4>
						</div>
						<div class="zzz">
							<h4 class="title">Order Number</h4>
							<h4 class="isi">: #%d</h4>
						</div>
						<div class="zzz">
							<h4 class="title">Invoice Date</h4>
							<h4 class="isi">: %s</h4>
						</div>
						<div class="zzz">
							<h4 class="title">Payment Method</h4>
							<h4 class="isi">: %s</h4>
						</div>
						<div class="zzz">
							<h4 class="title">Currency</h4>
							<h4 class="isi">: %s</h4>
						</div>
						<div class="zzz">
							<h4 class="title">Status</h4>
							<h4 class="isi success">: success</h4>
						</div>
					</div>
				</div>
			</body>
		</html>
		`, title, total, customer, order_number, invoice_date, payment_method, currency))

		dialer := gomail.NewDialer(
			CONFIG_SMTP_HOST,
			CONFIG_SMTP_PORT,
			CONFIG_AUTH_EMAIL,
			CONFIG_AUTH_PASSWORD,
		)
		err := dialer.DialAndSend(mailer)
		if err != nil {
			log.Fatal(err.Error())
		}
		log.Println("Mail sent to " + funder.User.Email + "!")
	}
}
