package services

import (
	"net/http"
	"sight-reading/database"
	"sight-reading/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetTeachers(c *gin.Context) {
	var posts []models.User

	query := `
  SELECT id, first_name, last_name
  FROM posts
  WHERE role = 'teacher'
  ORDER BY id;
  `

	err := database.DBClient.Select(&posts, query)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   true,
			"message": "Invalid request body",
		})
		return
	}

	c.JSON(http.StatusOK, posts)
}

func GetTeacher(c *gin.Context) {
	idSrt := c.Param("id")
	id, err := strconv.Atoi(idSrt)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   true,
			"message": "Invalid request body",
		})
		return
	}

	var post models.User

	query := `
  SELECT id, first_name, last_name
  FROM posts
  WHERE id = $1;
  `
	err = database.DBClient.Get(&post, query, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   true,
			"message": "not found",
		})
		return
	}
	c.JSON(http.StatusOK, post)
}

func GetDistrictTeachers(c *gin.Context) {
	// i think this is going to be some sort of left join
	query := `
  SELECT id, firsname, lastname 
  WHERE user.districtID = $1
  AND user.role = 'STUDENT'
  `
}

func GetDistrictStudents(c *gin.Context) {
	query := `
  SELECT id, firsname, lastname 
  WHERE user.districtID = $1
  AND user.role = 'STUDENT'
  `
}