package main

import (
	"context"
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
	"time"
)

var postgres *sql.DB
var mongodb *mongo.Client

func connectPostgres() {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+"password=%s dbname=%s sslmode=disable", os.Getenv("PGHOST"), os.Getenv("PGPORT"), os.Getenv("PGUSER"), os.Getenv("PGPASSWORD"), os.Getenv("PGDATABASE"))

	// connect to Postgres database
	postgres, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
		return
	}
	fmt.Println("CONNECTED TO POSTGRES")

	// create tables on initial setup
	_, err = postgres.Exec("CREATE TABLE IF NOT EXISTS sessions(sessionname TEXT PRIMARY KEY, username VARCHAR(40), expiration TIMESTAMP WITH TIME ZONE);")
	if err != nil {
		panic(err)
		return
	}

	_, err = postgres.Exec("CREATE TABLE IF NOT EXISTS admins(adminname VARCHAR(40) PRIMARY KEY, password TEXT);")
	if err != nil {
		panic(err)
		return
	}

	return
}

func connectMongo() {
	uri := fmt.Sprintf("mongodb://%s:%s@%s:%s", os.Getenv("MONGOUSER"), os.Getenv("MONGOPASSWORD"), os.Getenv("DOMAIN"), os.Getenv("MONGOPORT"))

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongodb, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	defer func() {
		if err = mongodb.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()

	fmt.Println("CONNECTED TO MONGODB")
	return
}
