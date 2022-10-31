package main

import (
	"log"
	"net/http"
)

func main() {

	connectPostgres()

	connectMongo()

	http.HandleFunc("/ping", ping)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
