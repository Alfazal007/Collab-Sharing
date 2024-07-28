package controller

import (
	"messsage-queue/internal/database"

	"github.com/redis/go-redis/v9"
)

type ApiConfig struct {
	DB    *database.Queries
	Redis *redis.Client
}
