package generation

import (
	"fmt"
	"strings"

	"github.com/manveru/faker"
)

func GenerateData() {
	initFaker()
	println(strings.Repeat("------------------------------", 2))
	println("\nGenerating data...\n")
	println(strings.Repeat("------------------------------", 2))

	fake, err := faker.New("en")
	if err != nil {
		panic(err)
	}
	println(fake.CompanyName() + " ISD")
	println(fake.CompanyName() + " ISD")
	fmt.Println(GenerateFakeDistrict())
	fmt.Println(GenerateFakeTeacher())
	fmt.Println(GenerateFakeStudent())
}
