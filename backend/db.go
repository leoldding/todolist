package main

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"os"
	"sync"
)

var postgres *sql.DB
var mongodb *mongo.Client
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
		_, err = postgres.Exec("CREATE TABLE IF NOT EXISTS sessions(sessionname TEXT PRIMARY KEY, username VARCHAR(40), expiration TIMESTAMP WITH TIME ZONE);")
		if err != nil {
			log.Printf("Error creating sessions table in Postgres: %v", err)
			return
		}
		wg.Done()
	}()

	wg.Add(1)
	go func() {
		_, err = postgres.Exec("CREATE TABLE IF NOT EXISTS users(username VARCHAR(40) PRIMARY KEY, password TEXT);")
		if err != nil {
			log.Printf("Error creating users table in Postgres: %v", err)
			return
		}
		wg.Done()
	}()

	wg.Add(1)
	go func() {
		_, err = postgres.Exec("CREATE TABLE IF NOT EXISTS tasks(id SERIAL PRIMARY KEY, username VARCHAR(40), description TEXT);")
		if err != nil {
			log.Printf("Error creating tasks table in Postgres: %v", err)
			return
		}
		wg.Done()
	}()

	return
}

/**
func connectMongo() {
	// create mongodb uri
	uri := fmt.Sprintf("mongodb://%s:%s@%s:%s", os.Getenv("MONGOUSER"), os.Getenv("MONGOPASSWORD"), os.Getenv("DOMAIN"), os.Getenv("MONGOPORT"))

	// connect to mongodb
	mongodb, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		log.Printf("Error connectiong to MongoDB: %v", err)
		return
	}
	defer func() {
		if err = mongodb.Disconnect(context.TODO()); err != nil {
			log.Printf("MongoDB disconnect error: %v", err)
		}
	}()

	return
}
*/
