package main

// TODO: move the routers into a controller
import (
	"flag"
	"sight-reading/controllers"
	"sight-reading/database"
	"sight-reading/generation"

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

	// faker flag
	runPackage := flag.Bool("fake-it", false, "use this flag to generate data")

	flag.Parse()

	if *runPackage {
		generation.GenerateData()
	}
}
