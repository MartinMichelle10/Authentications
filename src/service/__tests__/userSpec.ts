import { UserAttributes } from '../../types/user.type'
import UserService from '../user.service'

describe('User Model', () => {
  describe('Test methods exists', () => {
    it('should have an Get Many Users method', () => {
      expect(UserService.getMany).toBeDefined()
    })

    it('should have a Get One User method', () => {
      expect(UserService.getOne).toBeDefined()
    })

    it('should have a Create User method', () => {
      expect(UserService.create).toBeDefined()
    })

    it('should have a Delete User method', () => {
      expect(UserService.deleteOne).toBeDefined()
    })

    it('should have an Authenticate User method', () => {
      expect(UserService.authenticate).toBeDefined()
    })
  })

  describe('Test User Model Logic', () => {
    const user = {
      email: 'test228@test.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'test123',
    } as UserAttributes

    beforeAll(async () => {
      const createdUser = await UserService.create(user)
      user.identifier = createdUser.identifier
    })

    afterAll(async () => await UserService.deleteOne(user.identifier as string))

    it('Create method should return a New User', async () => {
      const createdUser = await UserService.create({
        email: 'test2c@test.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'test123',
      } as UserAttributes)

      expect(createdUser.dataValues).toEqual({
        identifier: createdUser.get('identifier'),
        email: 'test2c@test.com',
        firstName: 'Test',
        lastName: 'User',
      })

      await UserService.deleteOne(createdUser.get('identifier') as string)
    })

    it('Get Many method should return All available users in DB', async () => {
      const users = await UserService.getMany()
      expect(users.length).toBe(2)
    })

    it('Get One method should return testUser when called with ID', async () => {
      const returnedUser = await UserService.getOne(user.identifier as string)
      expect(returnedUser.identifier).toBe(user.identifier)
      expect(returnedUser.email).toBe(user.email)
      expect(returnedUser.firstName).toBe(user.firstName)
      expect(returnedUser.lastName).toBe(user.lastName)
    })
  })
})
