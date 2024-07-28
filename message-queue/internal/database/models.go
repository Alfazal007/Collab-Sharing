// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0

package database

import (
	"database/sql/driver"
	"fmt"
)

type Provider string

const (
	ProviderGOOGLE      Provider = "GOOGLE"
	ProviderCREDENTIALS Provider = "CREDENTIALS"
)

func (e *Provider) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = Provider(s)
	case string:
		*e = Provider(s)
	default:
		return fmt.Errorf("unsupported scan type for Provider: %T", src)
	}
	return nil
}

type NullProvider struct {
	Provider Provider
	Valid    bool // Valid is true if Provider is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullProvider) Scan(value interface{}) error {
	if value == nil {
		ns.Provider, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.Provider.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullProvider) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.Provider), nil
}

type Community struct {
	ID     string
	Name   string
	UserId string
}

type Message struct {
	ID         string
	FromUserId string
	ToUserId   string
	Message    string
}

type Post struct {
	ID      string
	Title   string
	Content string
	UserId  string
}

type PostInCommunity struct {
	A string
	B string
}

type Save struct {
	ID       string
	UserId   string
	Category string
	PostId   string
}

type User struct {
	ID       string
	Username string
	Email    string
	Provider Provider
	Password string
	Name     string
}

type UserToCommunity struct {
	A string
	B string
}
