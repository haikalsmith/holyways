package repositories

import (
	"holyways/models"

	"gorm.io/gorm"
)

type FunderRepository interface {
	FindFunder() ([]models.Funder, error)
	FindFunderByLogin(userId int) ([]models.Funder, error)
	FindFunderByStatusSucces(userId int) ([]models.Funder, error)
	FindFunderByDonationID(donationId int) ([]models.Funder, error)
	GetFunder(ID int) (models.Funder, error)
	GetFunderID(funderId int) (models.Funder, error)
	GetFunderByDonation(ID int) ([]models.Funder, error)
	CreateFunder(transaction models.Funder) (models.Funder, error)
	UpdateFunder(status string, orderId int) (models.Funder, error)
}

func RepositoryFunder(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindFunder() ([]models.Funder, error) {
	var funders []models.Funder
	err := r.db.Preload("Donation.User").Preload("User").Find(&funders).Error

	return funders, err
}

func (r *repository) FindFunderByDonationID(donationId int) ([]models.Funder, error) {
	var funders []models.Funder
	err := r.db.Where("donation_id=?", donationId).Where("status=?", "success").Preload("Donation").Preload("User").Find(&funders).Error

	return funders, err
}

func (r *repository) FindFunderByLogin(userId int) ([]models.Funder, error) {
	var funders []models.Funder
	err := r.db.Where("user_id", userId).Preload("Donation").Preload("User").Find(&funders).Error

	return funders, err
}


func (r *repository) FindFunderByStatusSucces(userId int) ([]models.Funder, error) {
	var funders []models.Funder
	err := r.db.Where("user_id", userId).Where("status=?", "success").Preload("Donation").Preload("User").Find(&funders).Error

	return funders, err
}

func (r *repository) GetFunder(ID int) (models.Funder, error) {
	var funder models.Funder
	err := r.db.Preload("Donation").Preload("User").First(&funder, ID).Error

	return funder, err
}

func (r *repository) GetFunderID(funderId int) (models.Funder, error) {
	var funder models.Funder
	err := r.db.Preload("Donation").Preload("User").First(&funder, funderId).Error

	return funder, err
}

func (r *repository) GetFunderByDonation(ID int) ([]models.Funder, error) {
	var funders []models.Funder
	err := r.db.Where("donation_id", ID).Find(&funders).Error

	return funders, err
}

func (r *repository) CreateFunder(funder models.Funder) (models.Funder, error) {

	err := r.db.Preload("Donation").Preload("User").Create(&funder).Error

	return funder, err
}

func (r *repository) UpdateFunder(status string, orderId int) (models.Funder, error) {
	var funder models.Funder

	r.db.Preload("Donation").Preload("User").First(&funder, orderId)
	if status != funder.Status && status == "success" {
		var donation models.Donation
		r.db.First(&donation, funder.Donation.ID)
		donation.CurrentGoal = donation.CurrentGoal + funder.Total
		donation.Goal = donation.Goal + 1
		r.db.Save(&donation)
	}

	funder.Status = status
	err := r.db.Save(&funder).Error

	return funder, err
}

