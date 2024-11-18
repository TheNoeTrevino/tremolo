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
	fmt.Println(generateFakeDistrict())
	fmt.Println(generateFakeTeacher())
	fmt.Println(generateFakeStudent())
}
