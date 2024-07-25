package main

import (
	"backend/handler"
	"backend/model"
	"backend/repository"
	"log"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	db, err := repository.InitDB()
	if err != nil {
		log.Printf("failed to connect database: %v", err)
		return
	}
	db.AutoMigrate(&model.Book{})

	h := handler.NewHandler(db)
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{echo.GET, echo.POST},
	}))

	e.GET("/books", h.GetBooks)
	e.GET("/books/:id", h.GetBook)
	e.POST("/books", h.CreateBook)

	e.Logger.Fatal(e.Start(":8080"))
}
