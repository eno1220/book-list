package handler

import (
	"backend/model"
	"backend/utils"
	"fmt"
	"net/http"

	"github.com/labstack/echo"
	"gorm.io/gorm"
)

type Handler struct {
	db *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{db}
}

func (h *Handler) GetBooks(c echo.Context) error {
	var books []model.Book
	result := h.db.Find(&books)
	if result.Error != nil {
		fmt.Println(result.Error)
		return c.JSON(http.StatusInternalServerError, result.Error)
	}
	return c.JSON(http.StatusOK, books)
}

func (h *Handler) GetBook(c echo.Context) error {
	id := c.Param("id")
	var book model.Book
	result := h.db.First(&book, id)
	if result.Error != nil {
		fmt.Println(result.Error)
		return c.JSON(http.StatusNotFound, result.Error)
	}
	return c.JSON(http.StatusOK, book)
}

func (h *Handler) CreateBook(c echo.Context) error {
	book := &model.Book{}
	if err := c.Bind(book); err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusBadRequest, err)
	}
	if book.Title == "" || book.Author == "" {
		return c.JSON(http.StatusBadRequest, "title and author are required")
	}
	if book.ISBN != nil && !utils.ValidateISBN(*book.ISBN) {
		return c.JSON(http.StatusBadRequest, "invalid ISBN")
	}
	result := h.db.Create(&book)
	if result.Error != nil {
		fmt.Println(result.Error)
		return c.JSON(http.StatusInternalServerError, result.Error)
	}
	return c.JSON(http.StatusCreated, book)
}
