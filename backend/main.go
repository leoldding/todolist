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

	// start all handlers
	http.HandleFunc("/ping", ping)
	http.HandleFunc("/signup", signup)
	http.HandleFunc("/login", login)
	http.HandleFunc("/logout", logout)
	http.HandleFunc("/refresh", refresh)
	http.HandleFunc("/check", check)
	http.HandleFunc("/addTask", addTask)
	http.HandleFunc("/retrieveTasks", retrieveTasks)
	http.HandleFunc("/deleteTask", deleteTask)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
