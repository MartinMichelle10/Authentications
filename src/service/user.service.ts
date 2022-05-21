import bcrypt from 'bcrypt'
import db from '../database'
import config from '../config'
import { UserAttributes } from '../types/user.type'

const userModel = db.User

const hashPassword = (password: string) => {
  const salt = parseInt(config.salt as string, 10)
  return bcrypt.hashSync(`${password}${config.pepper}`, salt)
}

class UserService {
  create = async (user: UserAttributes) => {
    const { firstName, lastName, email, password, roleId } = user

    const newUserData: UserAttributes = {
      firstName,
      lastName,
      email,
      roleId,
      password: hashPassword(password as string),
      refreshToken: db.sequelize.fn('UUID'),
    }

    const newUser = await userModel.create(newUserData)

    const userData = await userModel.findOne({
      attributes: ['firstName', 'lastName', 'email', 'identifier', 'roleId'],
      where: {
        email: newUser.get('email'),
      },
    })

    return userData
  }

  getMany = async () => {
    const users = await userModel.findAll({
      attributes: ['firstName', 'lastName', 'email', 'identifier', 'roleId'],
    })

    return users
  }

  getOne = async (id: string) => {
    // req.params.id as unknown as string
    const user = await userModel.findOne({
      attributes: ['firstName', 'lastName', 'email', 'identifier', 'roleId'],
      where: { identifier: id },
    })

    return user
  }

  authenticate = async (data: any) => {
    const { email, password } = data

    const user = await userModel.findOne({
      attributes: ['firstName', 'lastName', 'email', 'identifier', 'password'],
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    const hashPassword = user.get('password')

    const isPasswordValid = bcrypt.compareSync(
      `${password}${config.pepper}`,
      hashPassword
    )

    if (!isPasswordValid) {
      return null
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
      return null
    }

    const userData = await userModel.findOne({
      attributes: [
        'firstName',
        'lastName',
        'email',
        'identifier',
        'refreshToken',
        'roleId',
      ],
      where: {
        email,
      },
    })

    return userData
  }

  refreshTokenOfUser = async (data: any) => {
    const { refreshToken } = data

    const user = await userModel.findOne({
      attributes: ['firstName', 'lastName', 'email', 'identifier', 'password'],
      where: {
        refreshToken,
      },
    })

    if (!user) {
      return null
    }

    const updateUser = await userModel.update(
      {
        refreshToken: db.sequelize.fn('UUID'),
      },
      {
        where: { refreshToken },
      }
    )

    if (!updateUser) {
      return null
    }

    const userDta = await userModel.findOne({
      attributes: [
        'firstName',
        'lastName',
        'email',
        'identifier',
        'refreshToken',
        'roleId',
      ],
      where: {
        identifier: user.get('identifier'),
      },
    })

    return userDta
  }

  deleteOne = async (id: string) => {
    const deletedUser = await userModel.destroy({
      where: {
        identifier: id,
      },
    })

    return deletedUser
  }
}

export default new UserService()
