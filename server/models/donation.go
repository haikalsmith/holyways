package models

import "time"

type Donation struct {
	ID          int                  `json:"id"`
	Title       string               `json:"title" gorm:"type: varchar(255)"`
	Thumbnail   string               `json:"thumbnail"`
	Goal        int                  `json:"goal"`
	CurrentGoal int                  `json:"current_goal"`
	Description string               `json:"description" gorm:"type: varchar(1023)"`
	User        UsersProfileResponse `json:"user"`
	UserID      int                  `json:"user_id"`
	CreatedAt   time.Time            `json:"-"`
	UpdatedAt   time.Time            `json:"-"`
}

type DonationResponse struct {
	ID          int                  `json:"id"`
	Title       string               `json:"title"`
	UserID      int                  `json:"user_id"`
	User        UsersProfileResponse `json:"user"`
	Goal        int                  `json:"goal"`
	Description string               `json:"description"`
	Thumbnail   string               `json:"thumbnail"`
}

type DonationUserResponse struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	CurrentGoal int    `json:"current_goal"`
	UserID      int    `json:"user_id"`
}

func (DonationUserResponse) TableName() string {
	return "donations"
}

func (DonationResponse) TableName() string {
	return "donations"
}
