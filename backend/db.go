package main

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"log"
	"os"
	"sync"
)

var postgres *sql.DB

var err error

func connectPostgres() {
	var wg sync.WaitGroup

	// create postgres uri
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+"password=%s dbname=%s sslmode=disable", os.Getenv("PGHOST"), os.Getenv("PGPORT"), os.Getenv("PGUSER"), os.Getenv("PGPASSWORD"), os.Getenv("PGDATABASE"))

	// connect to Postgres database
	postgres, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Printf("Error connectiong to Postgres database: %v", err)
		return
	}

	// create tables on initial setup
	wg.Add(1)
	go func() {
		_, err = postgres.Exec("CREATE TABLE IF NOT EXISTS todoSessions(sessionname TEXT PRIMARY KEY, username VARCHAR(40), expiration TIMESTAMP WITH TIME ZONE);")
		if err != nil {
			log.Printf("Error creating sessions table in Postgres: %v", err)
			return
		}
		wg.Done()
	}()

	wg.Add(1)
	go func() {
		_, err = postgres.Exec("CREATE TABLE IF NOT EXISTS todoUsers(username VARCHAR(40) PRIMARY KEY, password TEXT);")
		if err != nil {
			log.Printf("Error creating users table in Postgres: %v", err)
			return
		}
		wg.Done()
	}()

	wg.Add(1)
	go func() {
		_, err = postgres.Exec("CREATE TABLE IF NOT EXISTS todoTasks(id SERIAL PRIMARY KEY, username VARCHAR(40), description TEXT);")
		if err != nil {
			log.Printf("Error creating tasks table in Postgres: %v", err)
			return
		}
		wg.Done()
	}()

	return
}
