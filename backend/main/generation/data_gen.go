package generation

import (
	"fmt"
	"strings"
)

func GenerateData() {
	initFaker()

	println(strings.Repeat("------------------------------", 2))
	println("\nGenerating data...\n")
	println(strings.Repeat("------------------------------", 2))

	// testing
	fmt.Println(insertFakeSchools())
	fmt.Println(insertFakeTeacherWithStudents())
}
