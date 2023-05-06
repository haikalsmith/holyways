package repositories

import (
	"holyways/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	FindUsers() ([]models.UsersProfileResponse, error)
	GetUser(ID int) (models.User, error)
	GetUserIDByLogin(ID int) (models.User, error)
	UpdateUser(user models.User) (models.User, error)
	DeleteUser(user models.User, ID int) (models.User, error)
}

func RepositoryUser(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindUsers() ([]models.UsersProfileResponse, error) {
	var users []models.UsersProfileResponse
	err := r.db.Find(&users).Error // Using Find method ORM

	return users, err
}

func (r *repository) GetUser(ID int) (models.User, error) {
	var user models.User
	err := r.db.First(&user, ID).Error

	return user, err
}

func (r *repository) GetUserIDByLogin(ID int) (models.User, error) {
	var user models.User
	err := r.db.Where("id=?", ID).Find(&user).Error

	return user, err
}

func (r *repository) UpdateUser(user models.User) (models.User, error) {
	err := r.db.Save(&user).Error // Using Save method ORM

	return user, err
}

func (r *repository) DeleteUser(user models.User, ID int) (models.User, error) {
	err := r.db.Delete(&user, ID).Error

	return user, err
}
