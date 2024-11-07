package services

import (
	"net/http"
	"sight-reading/database"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type Post struct {
	ID        *int16    `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	Title     string    `json:"title" db:"title"`
	Content   string    `json:"content" db:"content"`
}

func CreatePost(c *gin.Context) {
	var reqBody Post

	err := c.ShouldBindJSON(&reqBody)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   true,
			"message": "Invalid request body",
		})
		return
	}

	query := `INSERT INTO posts (title, content) VALUES (:title, :content) RETURNING id`
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

func GetPosts(c *gin.Context) {
	var posts []Post

	err := database.DBClient.Select(&posts, "SELECT id, title, content, created_at FROM posts ORDER BY id;")
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   true,
			"message": "Invalid request body",
		})
		return
	}

	c.JSON(http.StatusOK, posts)
}

func GetPost(c *gin.Context) {
	idSrt := c.Param("id")
	id, err := strconv.Atoi(idSrt)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   true,
			"message": "Invalid request body",
		})
		return
	}

	var post Post
	err = database.DBClient.Get(
		&post,
		"SELECT id, title, content, created_at FROM posts WHERE id = $1;", id,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   true,
			"message": "not found",
		})
		return
	}
	c.JSON(http.StatusOK, post)
}

func UpdatePost(c *gin.Context) {
}
