package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"messsage-queue/controller"
	"messsage-queue/internal/database"
	"os"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	portNumber := os.Getenv("PORT")
	if portNumber == "" {
		log.Fatal("Error getting port number from the env variables")
	}
	redisUrl := os.Getenv("REDIS_URL")
	if redisUrl == "" {
		log.Fatal("Error getting the redis url from the env variables")
	}
	redisPassword := os.Getenv("REDIS_PASSWORD") // TODO:: ADD ACTUAL PASSWORD AND UNCOMMENT THE LINE
	// if redisPassword == "" {
	// log.Fatal("Error getting the redis password from the env variables")
	// }

	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("DB url is not found in env variables")
	}
	conn, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Cannot connect to the database", err)
	}
	apiCfg := controller.ApiConfig{DB: database.New(conn), Redis: redis.NewClient(&redis.Options{
		Addr:     redisUrl,
		Password: redisPassword,
		DB:       0,
	})}

	// main logic
	for {
		data := apiCfg.Redis.BRPop(context.Background(), 0, "database-redis-sync")
		val, err := data.Result()
		if err != nil {
			fmt.Println("Error popping from Redis:", err)
			continue
		}

		var message controller.MessageType
		err = json.Unmarshal([]byte(val[1]), &message)
		if err != nil {
			fmt.Println("Error unmarshalling JSON:", err)
			continue
		}
		if message.From == "" || message.Message == "" || message.To == "" {
			continue
		}
		// add to the database
		// find the sender
		fromUserId, err := apiCfg.DB.GetUserByEmail(context.Background(), message.From)
		if err != nil {
			continue
		}
		toUserId, err := apiCfg.DB.GetUserByEmail(context.Background(), message.To)
		if err != nil {
			continue
		}
		_, err = apiCfg.DB.CreateMessage(context.Background(), database.CreateMessageParams{
			ID:         uuid.New().String(),
			FromUserId: fromUserId,
			ToUserId:   toUserId,
			Message:    message.Message,
		})
		if err != nil {
			fmt.Println("Error adding the data to the database", err)
		}
	}
}
