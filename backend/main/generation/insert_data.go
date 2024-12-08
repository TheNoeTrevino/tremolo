package generation

import (
	"fmt"
	"log"
	"math/rand/v2"
	dtos "sight-reading/DTOs"
	"sight-reading/database"
)

func insertFakeEntry(userId int16) {
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
		UserID:           userId,
		CreatedDate:      generateFakeDateCreated(),
		CreatedTime:      generateFakeTimeCreated(),
	}
	entry.ValidateEntry()
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
    country,
    created_time,
    created_date
  )
  VALUES (
    :title,
    :city,
    :county,
    :state,
    :country,
    :created_time,
    :created_date
  )
  RETURNING
    id
  `
	for i := 0; i < 1000; i++ {
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

	schoolId := int16(rand.IntN(1000))
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

	for i := 0; i < 20; i++ {
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

		for i := 0; i < 10+rand.IntN(200); i++ {
			insertFakeEntry(int16(studentId))
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
		associationIds := fakeTeacherToStudent{
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
