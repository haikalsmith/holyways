package routes

import (
	"holyways/handlers"
	"holyways/pkg/middleware"
	"holyways/pkg/mysql"
	"holyways/repositories"

	"github.com/labstack/echo/v4"
)

func UserRoute(e *echo.Group) {
	userRepository := repositories.RepositoryUser(mysql.DB)
	h := handlers.HandlerUser(userRepository)

	e.GET("/users", h.FindUser)
	e.GET("/user/:id", h.GetUser)
	e.GET("/user-by-login", middleware.Auth(h.GetUserIDByLogin))
	e.PATCH("/user/:id", h.UpdateUser)
	e.DELETE("/user/:id", h.DeleteUser)
}
