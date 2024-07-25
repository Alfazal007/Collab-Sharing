package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/smtp"
	"os"

	"github.com/Alfazal007/Collab-Sharing/datatypes"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

var fromAddress string
var password string

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	portNumber := os.Getenv("PORT")
	if portNumber == "" {
		log.Fatal("Error getting port number from the env variables")
	}
	fromAddress = os.Getenv("FROM_ADDRESS")
	if fromAddress == "" {
		log.Fatal("Error getting from address from the env variables")
	}
	password = os.Getenv("PASSWORD")
	if password == "" {
		log.Fatal("Error getting password from the env variables")
	}
	redisUrl := os.Getenv("REDIS_URL")
	if redisUrl == "" {
		log.Fatal("Error getting the redis url from the env variables")
	}
	redisPassword := os.Getenv("REDIS_PASSWORD") // TODO:: ADD ACTUAL PASSWORD AND UNCOMMENT THE LINE
	// if redisPassword == "" {
	// log.Fatal("Error getting the redis password from the env variables")
	// }
	rdb := redis.NewClient(&redis.Options{
		Addr:     redisUrl,
		Password: redisPassword,
		DB:       0,
	})
	// main logic
	for {
		data := rdb.BRPop(context.Background(), 0, "worker")
		val, err := data.Result()
		if err != nil {
			fmt.Println("Error popping from Redis:", err)
			continue
		}

		var dataInsert datatypes.EmailType
		err = json.Unmarshal([]byte(val[1]), &dataInsert)
		if err != nil {
			fmt.Println("Error unmarshalling JSON:", err)
			continue
		}
		if dataInsert.Type == "notification" {
			go SendMail(dataInsert.Community, dataInsert.Link, dataInsert.To)
		} else {
			println("Improper request")
		}
	}
}

func SendMail(community string, link string, to []string) {
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	// Message.
	message := []byte("Subject: New post uploaded on " + community + "\r\n" +
		"MIME-version: 1.0;\r\n" +
		"Content-Type: text/html; charset=\"UTF-8\";\r\n" +
		"\r\n" +
		"<html><body>" +
		"<p>New post uploaded on " + community + ".</p>" +
		"<p><a href=" + link + ">Click to view</a></p>" +
		"</body></html>")

	// Authentication.
	auth := smtp.PlainAuth("", fromAddress, password, smtpHost)

	// Sending email.
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, fromAddress, to, message)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Email Sent Successfully!")
}
