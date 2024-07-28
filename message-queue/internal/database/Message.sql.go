// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: Message.sql

package database

import (
	"context"
)

const createMessage = `-- name: CreateMessage :one
insert into "Message" ("id", "fromUserId", "toUserId", "message") values ($1, $2, $3, $4) returning id, "fromUserId", "toUserId", message
`

type CreateMessageParams struct {
	ID         string
	FromUserId string
	ToUserId   string
	Message    string
}

func (q *Queries) CreateMessage(ctx context.Context, arg CreateMessageParams) (Message, error) {
	row := q.db.QueryRowContext(ctx, createMessage,
		arg.ID,
		arg.FromUserId,
		arg.ToUserId,
		arg.Message,
	)
	var i Message
	err := row.Scan(
		&i.ID,
		&i.FromUserId,
		&i.ToUserId,
		&i.Message,
	)
	return i, err
}

const getUserByEmail = `-- name: GetUserByEmail :one
select "id" from "User" where "email"=$1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (string, error) {
	row := q.db.QueryRowContext(ctx, getUserByEmail, email)
	var id string
	err := row.Scan(&id)
	return id, err
}
