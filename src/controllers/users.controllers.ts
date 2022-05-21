import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../database'
import config from '../config'
import UserService from '../service/user.service'

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.create(req.body)

    res.json({
      status: 'success',
      data: user,
      message: 'User created successfully',
    })
  } catch (err) {
    next(err)
  }
}

export const getMany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserService.getMany()

    res.json({
      status: 'success',
      data: users,
      message: 'Users retrieved successfully',
    })
  } catch (err) {
    next(err)
  }
}

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.params.id as unknown as string
    const user = await UserService.getOne(req.params.id)

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'the user id do not match please try again',
      })
    }

    res.json({
      status: 'success',
      data: user,
      message: 'User retrieved successfully',
    })
  } catch (err) {
    next(err)
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.authenticate(req.body)

    const token = jwt.sign({ user }, config.tokenSecret as unknown as string)

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'the username and password do not match please try again',
      })
    }

    return res.json({
      status: 'success',
      data: { user: user, token },
      message: 'user authenticated successfully',
    })
  } catch (err) {
    return next(err)
  }
}

export const refreshTokenOfUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.refreshTokenOfUser(req.body)

    if (!user) {
      return res.status(401).json({
        status: 'error',
        // eslint-disable-next-line quotes
        message: "Can't refresh token of user please try again",
      })
    }

    const token = jwt.sign({ user }, config.tokenSecret as unknown as string)

    return res.json({
      status: 'success',
      data: { user, token },
      message: 'user authenticated successfully',
    })
  } catch (err) {
    return next(err)
  }
}
