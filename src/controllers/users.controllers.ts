import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'
import UserService from '../service/user.service'
import Redis from '../helpers/redis'

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

export const getAllRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await UserService.getAllRoles()

    res.json({
      status: 'success',
      data: roles,
      message: 'Roles retrieved successfully',
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

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'the username and password do not match please try again',
      })
    }

    const token = jwt.sign({ user }, config.tokenSecret as unknown as string, {
      expiresIn: `${(config.tokenExpiresIn as unknown as number) * 60000}ms`,
    })

    await Redis.set(
      token,
      token,
      (config.tokenExpiresIn as unknown as number) * 60
    )

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
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.refreshTokenOfUser(req.user)

    if (!user) {
      return res.status(401).json({
        status: 'error',
        // eslint-disable-next-line quotes
        message: "Can't refresh token of user please try again",
      })
    }

    const token = jwt.sign({ user }, config.tokenSecret as unknown as string, {
      expiresIn: `${(config.tokenExpiresIn as unknown as number) * 60000}ms`,
    })

    await Redis.set(
      token,
      token,
      (config.tokenExpiresIn as unknown as number) * 60
    )

    return res.json({
      status: 'success',
      data: { user, token },
      message: 'user authenticated successfully',
    })
  } catch (err) {
    return next(err)
  }
}

export const deleteOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.getOne(req.params.id)

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'the user id do not match please try again',
      })
    }

    const role = await UserService.getRole(user.get('roleId'))

    if (role.get('name') === 'Administrator') {
      return res.status(401).json({
        status: 'error',
        message: 'delete administrator is not allowed',
      })
    }

    const deletedUser = await UserService.deleteOne(req.params.id)

    res.json({
      status: 'success',
      data: deletedUser,
      message: 'User deleted successfully',
    })
  } catch (err) {
    next(err)
  }
}

export const logOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.get('Authorization')?.split(' ')[1]

    await Redis.del(token)

    res.json({
      status: 'success',
      data: null,
      message: 'Log out successfully',
    })
  } catch (err) {
    next(err)
  }
}

export const destroyAllSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Redis.flush()

    res.json({
      status: 'success',
      data: null,
      message: 'All Sessions destroyed',
    })
  } catch (err) {
    next(err)
  }
}
