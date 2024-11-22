package generation

import (
	"log"
	"math/rand/v2"
	"sight-reading/database"

	"github.com/manveru/faker"
)

type FakeParentToChildAssociation struct {
	ParentID int `db:"parent_id"`
	ChildID  int `db:"child_id"`
}

type FakeTeacherToParent struct {
	TeacherID int `db:"teacher_id"`
	ParentID  int `db:"parent_id"`
}

type FakeTeacherToStudent struct {
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
    school_id,
    role
  )
  VALUES (
    :first_name,
    :last_name,
    :school_id,
    :role
  )
  RETURNING
    id
  `

	teacher := dtos.User{
		FirstName: fake.FirstName(),
		LastName:  fake.LastName(),
		Role:      "TEACHER",
		SchoolID:  int16(rand.IntN(100)),
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
      INSERT INTO teacher_to_student (
        teacher_id,
        student_id
      )
      VALUES (
        :teacher_id,
        :student_id
      )
    `
		associationIds := FakeTeacherToStudent{
			TeacherID: teacherId,
			StudentID: studentId,
		}

		rows, err = database.DBClient.NamedQuery(associationQuery, associationIds)
		if err != nil {
			log.Panic("association from teacher to student was not added to db", err.Error())
		}
	}

	return teacher
}

func generateFakeUser(role dtos.Role) dtos.User {
	return dtos.User{
		FirstName: fake.FirstName(),
		LastName:  fake.LastName(),
		Role:      role,
		SchoolID:  int16(rand.IntN(100)),
	}
}

func generateFakeEntry() dtos.Entry {
	return dtos.Entry{
		TimeLength:       "",
		Questions:        int16(rand.IntN(100)),
		CorrectQuestions: int16(rand.IntN(100)),
		// UserID: int16, randomize according to a database call? we just need to
		// make sure it is right
	}
}
