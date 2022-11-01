package main

import (
	"log"
	"net/http"
	"sync"
)

func main() {
	var wg sync.WaitGroup

	// connect to postgres
	wg.Add(1)
	go func() {
		connectPostgres()
		defer wg.Done()
	}()

	// connect to mongodb
	wg.Add(1)
	go func() {
		connectMongo()
		defer wg.Done()
	}()

	wg.Wait()

	// start all handlers
	http.HandleFunc("/ping", ping)
	http.HandleFunc("/signup", signup)
	http.HandleFunc("/login", login)
	http.HandleFunc("/logout", logout)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
