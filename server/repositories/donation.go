package repositories

import (
	"holyways/models"

	"gorm.io/gorm"
)

type DonationRepository interface {
	FindDonation() ([]models.Donation, error)
	GetDonation(ID int) (models.Donation, error)
	CreateDonation(donation models.Donation) (models.Donation, error)
	GetDonationByUserID(userId int) ([]models.Donation, error)
	UpdateDonation(donation models.Donation) (models.Donation, error)
	DeleteDonation(donation models.Donation, ID int) (models.Donation, error)
}

func RepositoryDonation(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindDonation() ([]models.Donation, error) {
	var donations []models.Donation
	err := r.db.Preload("User").Find(&donations).Error

	return donations, err
}

func (r *repository) GetDonation(ID int) (models.Donation, error) {
	var donation models.Donation
	err := r.db.Preload("User").First(&donation, ID).Error

	return donation, err
}

func (r *repository) CreateDonation(donation models.Donation) (models.Donation, error) {
	err := r.db.Create(&donation).Error

	return donation, err
}

func (r *repository) GetDonationByUserID(userId int) ([]models.Donation, error) {
	var donations []models.Donation
	err := r.db.Where("user_id=?", userId).Preload("User").Find(&donations).Error
	return donations, err
}

func (r *repository) UpdateDonation(donation models.Donation) (models.Donation, error) {
  err := r.db.Save(&donation).Error // Using Save method ORM

  return donation, err
}

func (r *repository) DeleteDonation(donation models.Donation , ID int) (models.Donation, error) {
	err := r.db.Delete(&donation).Error // Using Delete method ORM
	
	return donation, err
}