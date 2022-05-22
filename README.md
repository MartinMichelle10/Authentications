## Description

API for managing User's Authentications and Authorizations

## Installation

```bash
$ npm install
```
or

```bash
$ yarn
```
## ERD db diagram
![Alt text](./db.digram.PNG?raw=true "Title")

## Installing Redis 
   We need to install redis to handle log out functions
   by adding all jwt tokens as whitelisted tokens
   and validate it using middleware

   ### For Linux installation
    https://redis.io/docs/getting-started/installation/install-redis-on-linux/
   ### For Windows installation
    https://github.com/tporadowski/redis/releases
## Running the app

```bash
# development
$ yarn dev
```


## Testing the app

```bash
# development
$ yarn test
```

## Swagger API docs 

http://localhost:3000/api-docs/
