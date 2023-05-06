package database

import (
	"fmt"
	"holyways/models"
	"holyways/pkg/mysql"
)

// Automatic Migration if Running App
// otomatis membuat table ketika memasukan models keadalam method AutoMigrate()
func RunMigration() {
	err := mysql.DB.AutoMigrate(
		&models.User{},
		&models.Donation{},
		&models.Funder{},
	)

	if err != nil {
		fmt.Println(err)
		panic("Migration Failed")
	}

	fmt.Println("Migration Success")
}
