import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import Error from '../interfaces/error.interface'
import config from '../config'
import Redis from '../helpers/redis'

const handleUnauthorizedError = (next: NextFunction) => {
  const error: Error = new Error('Unauthorized, Please login again')
  error.status = 401
  next(error)
}

const validateTokenMiddleware = (
  req: any,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.get('Authorization')
    if (authHeader) {
      const bearer = authHeader.split(' ')[0].toLowerCase()
      const token = authHeader.split(' ')[1]
      if (token && bearer === 'bearer') {
        const decode = jwt.verify(
          token,
          config.tokenSecret as unknown as string
        )

        if (decode) {
          Redis.getKeyData(token, (data: any) => {
            if (data) {
              const { user }: any = decode
              req.user = user
              next()
            } else {
              handleUnauthorizedError(next)
            }
          })
        } else {
          // Failed to authenticate user.
          handleUnauthorizedError(next)
        }
      } else {
        // token type not bearer
        handleUnauthorizedError(next)
      }
    } else {
      // No Token Provided.
      handleUnauthorizedError(next)
    }
  } catch (err) {
    handleUnauthorizedError(next)
  }
}

export default validateTokenMiddleware
