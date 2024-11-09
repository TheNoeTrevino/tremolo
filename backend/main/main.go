package main

// TODO: move the routers into a controller
import (
	"sight-reading/controllers"
	"sight-reading/database"

	"github.com/gin-gonic/gin"
)

func main() {
	database.InitializeDBConnection()

	router := gin.Default()

	controllers.SetupTeacherRoutes(router)

	err := router.Run(":5000")
	if err != nil {
		panic(err.Error())
	}
}
