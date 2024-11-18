package generation

import (
	"log"
	"math/rand/v2"
	"sight-reading/database"

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

type FakeAssociation struct {
	ParentID int
	ChildID  int
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

// FIX: take the teacher generation out, so we can have multiple student to
// multiple teachers
func generateFakeTeacherWithStudents() FakeUser {
	query := `
  INSERT INTO users (
    first_name,
    last_name,
    district_id,
    role
  )
  VALUES (
    :first_name,
    :last_name,
    :district_id,
    :role
  )
  RETURNING
    id
  `

	teacher := FakeUser{
		FirstName:  fake.FirstName(),
		LastName:   fake.LastName(),
		Role:       "TEACHER",
		DistrictID: int16(rand.IntN(100)),
	}
	rows, err := database.DBClient.NamedQuery(query, teacher)
	if err != nil {
		log.Panic("teacher was not added to the db", err.Error())
	}

	var teacherId int
	if rows.Next() {
		err := rows.Scan(teacherId)
		if err != nil {
			log.Panic("teacher id was not extracted properly", err.Error())
		}
	}

	for i := 0; i < 5; i++ {
		student := generateFakeUser("STUDENT")
		rows, err := database.DBClient.NamedQuery(query, student)
		if err != nil {
			log.Panic("student was not added to the db", err.Error())
		}

		var studentId int
		if rows.Next() {
			err := rows.Scan(studentId)
			if err != nil {
				log.Panic("student id was not extracted properly", err.Error())
			}
		}

		associationQuery := `
      INSERT INTO teacherToStudent (
        teacher_id,
        user_id,
      )
      VALUES (
        :teacher_id,
        :user_id,
      )
    `
		associationIds := FakeAssociation{
			ParentID: teacherId,
			ChildID:  studentId,
		}

		rows, err = database.DBClient.NamedQuery(associationQuery, associationIds)
		if err != nil {
			log.Panic("association from teacher to student was not added to db", err.Error())
		}
	}

	return teacher
}

func generateFakeUser(role string) FakeUser {
	return FakeUser{
		FirstName:  fake.FirstName(),
		LastName:   fake.LastName(),
		Role:       role,
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
