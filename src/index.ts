import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import errorMiddleware from './middleware/error.middleware'
import config from './config'
import routes from './routes'
import db from './database'
import Redis from './helpers/redis'

const PORT = config.port || 3000
// create an instance server
const app: Application = express()
// Middleware to parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json())
// HTTP request logger middleware
app.use(morgan('common'))
// HTTP security middleware headers
app.use(helmet())
// Basic rate-limiting middleware for Express
// Apply the rate limiting middleware to all requests
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
)

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      version: '1.0.0',
      title: 'Authentication and Authorization API',
      description: 'Authentication and Authorization API',
      contact: {
        name: 'Martin Michelle',
      },
      servers: ['http://localhost:3000'],
    },
    basePath: '/',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['**/*.ts'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use('/api', routes)

// add routing for / path
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World 🌍',
  })
})

// error handler middleware
app.use(errorMiddleware)

app.use((_: Request, res: Response) => {
  res.status(404).json({
    message: 'Ohh you are lost, read the API documentation',
  })
})

// start express server

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    Redis.connect((connected: any) => {
      if (connected) {
        console.log(`Server is starting at prot:${PORT}`)
      }
    })
  })
})

export default app
