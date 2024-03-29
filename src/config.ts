import dotenv from 'dotenv'

dotenv.config()

const {
  NODE_ENV,
  PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DB,
  MYSQL_DB_TEST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  BCRYPT_PASSWORD,
  SALT_ROUNDS,
  TOKEN_SECRET,
  JWT_ACCESS_EXPIRATION_MINUTES,
  REDIS_HOST,
  REDIS_PORT,
} = process.env

export default {
  port: PORT,
  host: MYSQL_HOST,
  dbPort: MYSQL_PORT,
  database: NODE_ENV === 'dev' ? MYSQL_DB : MYSQL_DB_TEST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  pepper: BCRYPT_PASSWORD,
  salt: SALT_ROUNDS,
  tokenSecret: TOKEN_SECRET,
  tokenExpiresIn: JWT_ACCESS_EXPIRATION_MINUTES,
  redisPort: REDIS_PORT,
  redisHost: REDIS_HOST,
}
