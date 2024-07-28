-- name: CreateMessage :one
insert into "Message" ("id", "fromUserId", "toUserId", "message") values ($1, $2, $3, $4) returning *;

-- name: GetUserByEmail :one
select "id" from "User" where "email"=$1;
