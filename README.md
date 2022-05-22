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
    
## Env variable example
```bash
# .env
PORT=3000
NODE_ENV=dev
# Set your database connection information here
MYSQL_HOST="your_host"
MYSQL_PORT=your_port_number
MYSQL_DB=authentication
MYSQL_USER=your_user_name
MYSQL_PASSWORD=your_db_pass
# authentication
BCRYPT_PASSWORD=your-secret-password
SALT_ROUNDS=10
TOKEN_SECRET=your-secret-token
JWT_ACCESS_EXPIRATION_MINUTES=10
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

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
