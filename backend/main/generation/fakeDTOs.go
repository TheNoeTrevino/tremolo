package generation

import (
	"log"
	"math/rand/v2"

	"github.com/manveru/faker"
)

type FakeDistrict struct {
	// ID      *int16 `db:"id"      json:"id"`
	Title   string
	County  string
	State   string
	Country string
}

type FakeUser struct {
	// ID          *int16
	FirstName   string
	LastName    string
	Role        string
	CreatedDate string
	DistrictID  int16
}

type FakeEntry struct {
	// ID               *int16
	TimeLength       string
	Questions        int16
	CorrectQuestions int16
	UserID           int16
}

var fake *faker.Faker

func initFaker() {
	var err error
	fake, err = faker.New("en")
	if err != nil {
		log.Fatal("Did not instantiate faker")
		panic(err)
	}
}

func GenerateFakeDistrict() FakeDistrict {
	return FakeDistrict{
		Title:   fake.FirstName() + " ISD",
		County:  fake.City(),
		State:   fake.State(),
		Country: fake.Country(),
	}
}

func generateFakeTeacher() FakeUser {
	return FakeUser{
		FirstName:  fake.FirstName(),
		LastName:   fake.LastName(),
		Role:       "TEACHER",
		DistrictID: int16(rand.IntN(100)),
	}
}

func generateFakeStudent() FakeUser {
	return FakeUser{
		FirstName:  fake.FirstName(),
		LastName:   fake.LastName(),
		Role:       "STUDENT",
		DistrictID: int16(rand.IntN(100)),
	}
}

func generateFakeEntry() FakeEntry {
	return FakeEntry{
		TimeLength:       "",
		Questions:        int16(rand.IntN(100)),
		CorrectQuestions: int16(rand.IntN(100)),
		// UserID: int16, randomize according to a database call? we just need to
		// make sure it is right
	}
}
