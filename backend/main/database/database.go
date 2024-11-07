package database

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var DBClient *sqlx.DB

func InitializeDBConnection() {
	db, err := sqlx.Open("postgres", "postgres://postgres:test123@localhost:5432/postgres?sslmode=disable")
	if err != nil {
		panic(err.Error())
	}

	err = db.Ping()
	if err != nil {
		panic(err.Error())
	}

	DBClient = db
}
