import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../database'
import config from '../config'
import { UserAttributes } from '../types/user.type'

const userModel = db.User

const hashPassword = (password: string) => {
  const salt = parseInt(config.salt as string, 10)
  return bcrypt.hashSync(`${password}${config.pepper}`, salt)
}

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password } = req.body

    const newUser: UserAttributes = {
      firstName,
      lastName,
      email,
      password: hashPassword(password as string),
      refreshToken: db.sequelize.fn('UUID'),
    }

    const user = await userModel.create(newUser)
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
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Here')
    const users = await userModel.findAll({
      attributes: ['firstName', 'lastName', 'email', 'identifier'],
    })
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
    const user = await userModel.findOne({
      attributes: ['firstName', 'lastName', 'email', 'identifier'],
      where: { identifier: req.params.id },
    })

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
    const { email, password } = req.body

    const user = await userModel.findOne({
      attributes: ['firstName', 'lastName', 'email', 'identifier', 'password'],
      where: {
        email,
      },
    })

    const hashPassword = user.get('password')

    const isPasswordValid = bcrypt.compareSync(
      `${password}${config.pepper}`,
      hashPassword
    )

    const token = jwt.sign({ user }, config.tokenSecret as unknown as string)

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'the username and password do not match please try again',
      })
    }

    const updateUser = await userModel.update(
      {
        refreshToken: db.sequelize.fn('UUID'),
      },
      {
        where: { email },
      }
    )

    if (!updateUser) {
      return res.status(401).json({
        status: 'error',
        message: 'the username and password do not match please try again',
      })
    }

    const userDta = await userModel.findOne({
      attributes: [
        'firstName',
        'lastName',
        'email',
        'identifier',
        'refreshToken',
      ],
      where: {
        email,
      },
    })

    return res.json({
      status: 'success',
      data: { user: userDta, token },
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
    const { refreshToken } = req.body

    const user = await userModel.findOne({
      attributes: ['firstName', 'lastName', 'email', 'identifier', 'password'],
      where: {
        refreshToken,
      },
    })

    if (!user) {
      return res.status(401).json({
        status: 'error',
        // eslint-disable-next-line quotes
        message: "Can't refresh token of user please try again",
      })
    }

    const token = jwt.sign({ user }, config.tokenSecret as unknown as string)

    const updateUser = await userModel.update(
      {
        refreshToken: db.sequelize.fn('UUID'),
      },
      {
        where: { refreshToken },
      }
    )

    if (!updateUser) {
      return res.status(401).json({
        status: 'error',
        // eslint-disable-next-line quotes
        message: "Can't refresh token of user please try again",
      })
    }

    const userDta = await userModel.findOne({
      attributes: [
        'firstName',
        'lastName',
        'email',
        'identifier',
        'refreshToken',
      ],
      where: {
        identifier: user.get('identifier'),
      },
    })

    return res.json({
      status: 'success',
      data: { user: userDta, token },
      message: 'user authenticated successfully',
    })
  } catch (err) {
    return next(err)
  }
}
