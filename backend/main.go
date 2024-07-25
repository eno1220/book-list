package main

import (
	"backend/handler"
	"backend/model"
	"backend/repository"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	db := repository.InitDB()
	db.AutoMigrate(&model.Book{})

	h := handler.NewHandler(db)
	e := echo.New()
	e.Use(middleware.Logger())

	e.GET("/books", h.GetBooks)
	e.GET("/books/:id", h.GetBook)
	e.POST("/books", h.CreateBook)

	e.Logger.Fatal(e.Start(":8080"))
}
