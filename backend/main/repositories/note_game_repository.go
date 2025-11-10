package repositories

import (
	"database/sql"
	dtos "sight-reading/DTOs"
	"sight-reading/database"

	"github.com/jmoiron/sqlx"
)

type NoteGameRepository struct {
	db *sqlx.DB
}

func NewNoteGameRepository() *NoteGameRepository {
	return &NoteGameRepository{db: database.DBClient}
}

// NoteGameEntry represents a note game entry
type NoteGameEntry struct {
	ID               int     `db:"id"`
	UserID           int     `db:"user_id"`
	TimeLength       string  `db:"time_length"`
	TotalQuestions   int     `db:"total_questions"`
	CorrectQuestions int     `db:"correct_questions"`
	NotesPerMinute   float64 `db:"notes_per_minute"`
	CreatedDate      string  `db:"created_date"`
}

// CreateNoteGameEntry inserts a new note game entry
func (r *NoteGameRepository) CreateNoteGameEntry(entry NoteGameEntry) (int64, error) {
	// language: sql
	query := `
		insert into note_game_entries (
			user_id,
			time_length,
			total_questions,
			correct_questions,
			notes_per_minute
		)
		values (
			:user_id,
			:time_length,
			:total_questions,
			:correct_questions,
			:notes_per_minute
		)
		returning id
	`

	rows, err := r.db.NamedQuery(query, entry)
	if err != nil {
		return 0, err
	}
	defer rows.Close()

	var entryID int64
	if rows.Next() {
		err = rows.Scan(&entryID)
		if err != nil {
			return 0, err
		}
	}

	return entryID, nil
}

// GetEntriesByUserID retrieves all note game entries for a user
func (r *NoteGameRepository) GetEntriesByUserID(userID int) ([]NoteGameEntry, error) {
	query := `
		select *
		from note_game_entries
		where user_id = $1
		order by created_date desc
	`

	var entries []NoteGameEntry
	err := r.db.Select(&entries, query, userID)
	if err != nil {
		return nil, err
	}

	return entries, nil
}

// FetchNPMData retrieves NPM (Notes Per Minute) data for chart visualization
func (r *NoteGameRepository) FetchNPMData(userID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	if interval == "all" {
		query = `
			select
				date_trunc('day', created_date) as timestamp,
				avg(notes_per_minute) as value
			from note_game_entries
			where user_id = $1
			group by date_trunc('day', created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, userID)
	} else {
		query = `
			select
				date_trunc($1, created_date) as timestamp,
				avg(notes_per_minute) as value
			from note_game_entries
			where user_id = $2
			  and created_date >= current_date - interval '1 day' * $3
			group by date_trunc($1, created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, interval, userID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	return data, nil
}

// FetchAccuracyData retrieves accuracy percentage data for chart visualization
func (r *NoteGameRepository) FetchAccuracyData(userID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	if interval == "all" {
		query = `
			select
				date_trunc('day', created_date) as timestamp,
				(sum(correct_questions)::float / nullif(sum(total_questions)::float, 0)) * 100 as value
			from note_game_entries
			where user_id = $1
			group by date_trunc('day', created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, userID)
	} else {
		query = `
			select
				date_trunc($1, created_date) as timestamp,
				(sum(correct_questions)::float / nullif(sum(total_questions)::float, 0)) * 100 as value
			from note_game_entries
			where user_id = $2
			  and created_date >= current_date - interval '1 day' * $3
			group by date_trunc($1, created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, interval, userID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	return data, nil
}

// FetchSessionCountData retrieves session count data for chart visualization
func (r *NoteGameRepository) FetchSessionCountData(userID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	if interval == "all" {
		query = `
			select
				date_trunc('day', created_date) as timestamp,
				count(*)::float as value
			from note_game_entries
			where user_id = $1
			group by date_trunc('day', created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, userID)
	} else {
		query = `
			select
				date_trunc($1, created_date) as timestamp,
				count(*)::float as value
			from note_game_entries
			where user_id = $2
			  and created_date >= current_date - interval '1 day' * $3
			group by date_trunc($1, created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, interval, userID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	return data, nil
}

// FetchTotalQuestionsData retrieves total questions count for chart visualization
func (r *NoteGameRepository) FetchTotalQuestionsData(userID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	if interval == "all" {
		query = `
			select
				date_trunc('day', created_date) as timestamp,
				sum(total_questions)::float as value
			from note_game_entries
			where user_id = $1
			group by date_trunc('day', created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, userID)
	} else {
		query = `
			select
				date_trunc($1, created_date) as timestamp,
				sum(total_questions)::float as value
			from note_game_entries
			where user_id = $2
			  and created_date >= current_date - interval '1 day' * $3
			group by date_trunc($1, created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, interval, userID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	return data, nil
}

// FetchTeacherNPMData retrieves aggregated NPM data for all students of a teacher
func (r *NoteGameRepository) FetchTeacherNPMData(teacherID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	if interval == "all" {
		query = `
			select
				date_trunc('day', nge.created_date) as timestamp,
				avg(nge.notes_per_minute) as value
			from note_game_entries nge
			inner join teacher_student ts on nge.user_id = ts.student_id
			where ts.teacher_id = $1
			group by date_trunc('day', nge.created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, teacherID)
	} else {
		query = `
			select
				date_trunc($1, nge.created_date) as timestamp,
				avg(nge.notes_per_minute) as value
			from note_game_entries nge
			inner join teacher_student ts on nge.user_id = ts.student_id
			where ts.teacher_id = $2
			  and nge.created_date >= current_date - interval '1 day' * $3
			group by date_trunc($1, nge.created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, interval, teacherID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	return data, nil
}

// FetchTeacherAccuracyData retrieves aggregated accuracy data for all students of a teacher
func (r *NoteGameRepository) FetchTeacherAccuracyData(teacherID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	if interval == "all" {
		query = `
			select
				date_trunc('day', nge.created_date) as timestamp,
				(sum(nge.correct_questions)::float / nullif(sum(nge.total_questions)::float, 0)) * 100 as value
			from note_game_entries nge
			inner join teacher_student ts on nge.user_id = ts.student_id
			where ts.teacher_id = $1
			group by date_trunc('day', nge.created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, teacherID)
	} else {
		query = `
			select
				date_trunc($1, nge.created_date) as timestamp,
				(sum(nge.correct_questions)::float / nullif(sum(nge.total_questions)::float, 0)) * 100 as value
			from note_game_entries nge
			inner join teacher_student ts on nge.user_id = ts.student_id
			where ts.teacher_id = $2
			  and nge.created_date >= current_date - interval '1 day' * $3
			group by date_trunc($1, nge.created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, interval, teacherID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	return data, nil
}

// FetchTeacherSessionCountData retrieves aggregated session count for all students of a teacher
func (r *NoteGameRepository) FetchTeacherSessionCountData(teacherID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	if interval == "all" {
		query = `
			select
				date_trunc('day', nge.created_date) as timestamp,
				count(*)::float as value
			from note_game_entries nge
			inner join teacher_student ts on nge.user_id = ts.student_id
			where ts.teacher_id = $1
			group by date_trunc('day', nge.created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, teacherID)
	} else {
		query = `
			select
				date_trunc($1, nge.created_date) as timestamp,
				count(*)::float as value
			from note_game_entries nge
			inner join teacher_student ts on nge.user_id = ts.student_id
			where ts.teacher_id = $2
			  and nge.created_date >= current_date - interval '1 day' * $3
			group by date_trunc($1, nge.created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, interval, teacherID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	return data, nil
}

// FetchTeacherTotalQuestionsData retrieves aggregated total questions for all students of a teacher
func (r *NoteGameRepository) FetchTeacherTotalQuestionsData(teacherID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	if interval == "all" {
		query = `
			select
				date_trunc('day', nge.created_date) as timestamp,
				sum(nge.total_questions)::float as value
			from note_game_entries nge
			inner join teacher_student ts on nge.user_id = ts.student_id
			where ts.teacher_id = $1
			group by date_trunc('day', nge.created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, teacherID)
	} else {
		query = `
			select
				date_trunc($1, nge.created_date) as timestamp,
				sum(nge.total_questions)::float as value
			from note_game_entries nge
			inner join teacher_student ts on nge.user_id = ts.student_id
			where ts.teacher_id = $2
			  and nge.created_date >= current_date - interval '1 day' * $3
			group by date_trunc($1, nge.created_date)
			order by timestamp asc
		`
		err = r.db.Select(&data, query, interval, teacherID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	return data, nil
}
