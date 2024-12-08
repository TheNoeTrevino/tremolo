package generation

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand/v2"
	dtos "sight-reading/DTOs"

	"github.com/manveru/faker"
)

type fakeParentToChildAssociation struct {
	ParentID int `db:"parent_id"`
	ChildID  int `db:"child_id"`
}

type fakeTeacherToParent struct {
	TeacherID int `db:"teacher_id"`
	ParentID  int `db:"parent_id"`
}

type fakeTeacherToStudent struct {
	TeacherID int `db:"teacher_id"`
	StudentID int `db:"student_id"`
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

func generateFakeSchool() dtos.School {
	num := rand.IntN(3)

	prefix := fake.FirstName()

	suffix := " Middle School"

	if num == 0 {
		suffix = " High School"
	}

	if num < 2 {
		prefix += " " + fake.LastName()
	}

	return dtos.School{
		Title:       prefix + suffix,
		City:        fake.City(),
		County:      fake.City(),
		State:       fake.State(),
		Country:     fake.Country(),
		CreatedDate: generateFakeDateCreated(),
		CreatedTime: generateFakeTimeCreated(),
	}
}

func generateFakeUser(role dtos.Role, schoolId int16) dtos.User {
	fakeFirstName := fake.FirstName()
	fakeLastName := fake.LastName()
	fakeEmail := fakeFirstName + "." + fakeLastName + "@email.com"
	user := dtos.User{
		FirstName:   fakeFirstName,
		LastName:    fakeLastName,
		Email:       fakeEmail,
		Role:        role,
		SchoolID:    schoolId,
		CreatedDate: generateFakeDateCreated(),
		CreatedTime: generateFakeTimeCreated(),
	}

	user.ValidateUser()

	return user
}

func generateFakeEntryTimeLength() string {
	hourAmount := rand.IntN(1)
	minutes := rand.IntN(60)
	seconds := rand.IntN(60)

	timeFormat := fmt.Sprintf("%02d:%02d:%02d", hourAmount, minutes, seconds)

	return timeFormat
}

func generateFakeDateCreated() sql.NullString {
	year := rand.IntN(2) + 2022
	month := rand.IntN(11) + 1
	day := rand.IntN(26) + 1

	timeFormat := fmt.Sprintf("%04d-%02d-%02d", year, month, day)

	return sql.NullString{
		String: timeFormat,
		Valid:  true,
	}
}

func generateFakeTimeCreated() sql.NullString {
	hourAmount := rand.IntN(24)
	minutes := rand.IntN(60)
	seconds := rand.IntN(60)

	timeFormat := fmt.Sprintf("%02d:%02d:%02d", hourAmount, minutes, seconds)

	return sql.NullString{
		String: timeFormat,
		Valid:  true,
	}
}
