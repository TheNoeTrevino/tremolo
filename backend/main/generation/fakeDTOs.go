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
	user := dtos.User{
		FirstName: fake.FirstName(),
		LastName:  fake.LastName(),
		Role:      role,
		SchoolID:  schoolId,
		// SchoolID:  int16(rand.IntN(100)),
	}

	user.ValidateUser()

	return user
}

// TODO: this is not done yet
func generateFakeEntryTimeLength() string {
	hourAmount := rand.IntN(1)
	minutes := rand.IntN(60)
	seconds := rand.IntN(60)

	timeFormat := fmt.Sprintf("%02d:%02d:%02d", hourAmount, minutes, seconds)

	return timeFormat
}

func generateFakeDateCreated() sql.NullString {
	year := rand.IntN(24) + 2000
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

func generateFakeEntry(userId int16) {
	// TODO: randomize the time length, created date, created time
	insertEntryQuery := `
  INSERT INTO note_game_entries (
    user_id,
    time_length,
    total_questions,
    correct_questions,
    notes_per_minute,
    created_date,
    created_time
  )
  VALUES (
    :user_id,
    :time_length,
    :total_questions,
    :correct_questions,
    :notes_per_minute,
    :created_date,
    :created_time
  )
  RETURNING
    id
  `
	correctQuestions := int16(rand.IntN(100))
	totalQuestions := correctQuestions + int16(rand.IntN(100))
	timeLength := generateFakeEntryTimeLength()

	entry := dtos.Entry{
		TimeLength:       timeLength,
		TotalQuestions:   totalQuestions,
		CorrectQuestions: correctQuestions,
		NPM:              int8(rand.IntN(100)),
		UserID:           userId, // randomize according to a database call? we just need to
		CreatedDate:      generateFakeDateCreated(),
		CreatedTime:      generateFakeTimeCreated(),
	}
	entry.ValidateEntry() // this is currently causing problems, make sure the random data is valid
	result, err := database.DBClient.NamedExec(insertEntryQuery, entry)
	if err != nil {
		log.Panicf(
			"an error ocurred inserting the entry to the database. Error: %v, \n Sql result: %v",
			err.Error(), result,
		)
	}
}

// Adds fake schools to the data base
func insertFakeSchools() string {
	insertSchoolQuery := `
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
		result, err := database.DBClient.NamedExec(insertSchoolQuery, fakeSchool)
		if err != nil {
			log.Panicf(
				"an error ocurred inserting the school to the database. Error: %v, \n Sql result: %v",
				err.Error(), result,
			)
		}
	}
	return "school inserted successfully"
}

func insertFakeTeacherWithStudents() dtos.User {
	insertUserQuery := `
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

	rows, err := database.DBClient.NamedQuery(insertUserQuery, teacher)
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
		rows, err := database.DBClient.NamedQuery(insertUserQuery, student)
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

		for i := 0; i < 10+rand.IntN(20); i++ {
			generateFakeEntry(int16(studentId))
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
