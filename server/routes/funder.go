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
	e.POST("/funder", middleware.Auth(h.CreateFunder))
}
