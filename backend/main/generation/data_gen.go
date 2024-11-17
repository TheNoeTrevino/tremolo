package generation

import (
	"github.com/manveru/faker"
)

func GenerateData() {
	fake, err := faker.New("en")
	if err != nil {
		panic(err)
	}
	println(fake.Name())  //> "Adriana Crona"
	println(fake.Email()) //> charity.brown@fritschbotsford.biz
}
