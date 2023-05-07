package routes

import (
	"holyways/handlers"
	"holyways/pkg/middleware"
	"holyways/pkg/mysql"
	"holyways/repositories"

	"github.com/labstack/echo/v4"
)

func FunderRoutes(e *echo.Group) {
	FunderRepository := repositories.RepositoryFunder(mysql.DB)

	h := handlers.HandlerFunder(FunderRepository)

	e.GET("/funders", h.FindFunder)
	e.GET("/funder", middleware.Auth(h.GetFunder))
	e.GET("/funder-by-login", middleware.Auth(h.FindFunderByLogin))
	e.GET("/funder-by-donation/:id", h.FindFunderByDonationID)
	e.POST("/funder", middleware.Auth(h.CreateFunder))
	e.POST("/notification", h.Notification)
}
