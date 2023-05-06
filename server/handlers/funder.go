package handlers

import (
	"fmt"
	funderdto "holyways/dto/funder"
	dto "holyways/dto/result"
	"holyways/models"
	"holyways/repositories"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
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

