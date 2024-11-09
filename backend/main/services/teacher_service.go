package services

import (
	"net/http"
	"sight-reading/database"
	"sight-reading/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateTeacher(c *gin.Context) {
	var reqBody models.User

	err := c.ShouldBindJSON(&reqBody)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   true,
			"message": "Invalid request body",
		})
		return
	}

	query := `
  INSERT INTO posts (
    first_name,
    last_name,
    content
  )
  VALUES (
  :title,
  :content
  )
  RETURNING id`

	rows, err := database.DBClient.NamedQuery(query, reqBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	var postID int64
	if rows.Next() {
		rows.Scan(&postID)
	}
	rows.Close()

	c.JSON(http.StatusCreated, gin.H{
		"body":    reqBody,
		"post_id": postID,
		"error":   false,
	})
}

// TODO:
func UpdateTeacher(c *gin.Context) {
}

func GetStudents(c *gin.Context) {
	idSrt := c.Param("id")
	id, err := strconv.Atoi(idSrt)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   true,
			"message": "Invalid request body",
		})
		return
	}

	query := `
  SELECT *
  WHERE user.role = 'student'
  AND user.teacher = $1;
  `

	var students []models.User
	err = database.DBClient.Get(&students, query, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   true,
			"message": "not found",
		})
		return
	}
	c.JSON(http.StatusOK, students)
}

func GetStudent(c *gin.Context) {
	idSrt := c.Param("id")
	queriedName := c.Param("name")
	id, err := strconv.Atoi(idSrt)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   true,
			"message": "Invalid request body",
		})
		return
	}

	// the and of this is not right
	query := `
  SELECT *
  WHERE user.role = 'student'
  AND user.teacher = $1;
  AND user.first_name LIKE '%$2%'
  OR user.last_name LIKE '%$2%'
  `

	var students models.User
	err = database.DBClient.Get(&students, query, id, queriedName)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   true,
			"message": "not found",
		})
		return
	}
	c.JSON(http.StatusOK, students)
}
