package generation

import (
	"fmt"
	"log"
	"math/rand/v2"
	dtos "sight-reading/DTOs"
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

func generateFakeSchool() dtos.School {
	return dtos.School{
		Title:   fake.FirstName() + " ISD",
		City:    fake.City(),
		County:  fake.City(),
		State:   fake.State(),
		Country: fake.Country(),
	}
}

func generateFakeUser(role dtos.Role, schoolId int16) dtos.User {
	return dtos.User{
		FirstName: fake.FirstName(),
		LastName:  fake.LastName(),
		Role:      role,
		SchoolID:  schoolId,
		// SchoolID:  int16(rand.IntN(100)),
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

func insertFakeSchools() string {
	query := `
  INSERT INTO schools (
    title,
    city,
    county,
    state,
    country
  )
  VALUES (
    :title,
    :city,
    :county,
    :state,
    :country
  )
  RETURNING
    id
  `
	for i := 0; i < 100; i++ {
		fakeSchool := generateFakeSchool()
		result, err := database.DBClient.NamedExec(query, fakeSchool)
		if err != nil {
			log.Panicf(
				"an error ocurred inserting the school to the database error: %v,  sql result %v",
				err.Error(), result,
			)
		}
	}
	return "school inserted successfully"
}

func insertFakeTeacherWithStudents() dtos.User {
	// NOTE: teacher generation
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

	schoolId := int16(rand.IntN(100))
	teacher := generateFakeUser("TEACHER", schoolId)

	rows, err := database.DBClient.NamedQuery(query, teacher)
	if err != nil {
		log.Panic("teacher was not added to the db", err.Error())
	}

	var teacherId int
	if rows.Next() {
		err := rows.Scan(&teacherId)
		if err != nil {
			log.Panic("teacher id was not extracted properly", err.Error())
		}
	}

	for i := 0; i < 5; i++ {
		student := generateFakeUser("STUDENT", schoolId)
		rows, err := database.DBClient.NamedQuery(query, student)
		if err != nil {
			log.Panic("student was not added to the db", err.Error())
		}

		var studentId int
		if rows.Next() {
			err := rows.Scan(&studentId)
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

		result, err := database.DBClient.NamedExec(associationQuery, associationIds)
		if err != nil {
			log.Panic("association from teacher to student was not added to db", err.Error())
		}
		fmt.Println(result.RowsAffected())
	}

	return teacher
}
