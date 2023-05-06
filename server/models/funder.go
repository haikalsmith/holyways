package models

type Funder struct {
	ID         int                  `json:"id"`
	CreatedAt  string               `json:"donate_at"`
	Total      int                  `json:"total"`
	Status     string               `json:"status"`
	DonationID int                  `json:"donation_id" form:"donation_id"`
	Donation   DonationResponse     `json:"donation" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	UserID     int                  `json:"-"`
	User       UsersProfileResponse `json:"user"`
}

type FunderUser struct {
	ID        int                 `json:"id"`
	CreatedAt string              `json:"donate_at"`
	Total     int                 `json:"total"`
	UserID    int                 `json:"-"`
	User      UsersFunderResponse `json:"user"`
}

func (FunderUser) TableName() string {
	return "funders"
}
