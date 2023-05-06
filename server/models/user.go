package models

import "time"

type User struct {
	ID        int                    `json:"id"`
	FullName  string                 `json:"fullName" gorm:"type: varchar(255)"`
	Email     string                 `json:"email" gorm:"unique;not null"`
	Password  string                 `json:"password" type:"varchar(255)"`
	Phone     int                    `json:"phone"`
	Image     string                 `json:"image" gorm:"type: varchar(255)"`
	Address   string                 `json:"address" gorm:"type: varchar(1023)"`
	Donation  []DonationUserResponse `json:"donations"`
	CreatedAt time.Time              `json:"-"`
	UpdatedAt time.Time              `json:"-"`
}

type UsersProfileResponse struct {
	ID       int    `json:"id"`
	FullName string `json:"fullName"`
	Email    string `json:"email"`
}

type UsersFunderResponse struct {
	ID       int    `json:"id"`
	FullName string `json:"fullName"`
}

func (UsersProfileResponse) TableName() string {
	return "users"
}
func (UsersFunderResponse) TableName() string {
	return "users"
}
