import { UserAttributes } from '../../types/user.type'
import UserService from '../user.service'

describe('Authentication Module', () => {
  describe('Test methods exists', () => {
    it('should have an Authenticate User method', () => {
      expect(UserService.authenticate).toBeDefined()
    })
  })

  describe('Test Authentication Logic', () => {
    const user = {
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'test123',
      roleId: 'iiiiiiiiiiiiiiiii',
    } as UserAttributes

    beforeAll(async () => {
      const createdUser = await UserService.create(user)
      user.identifier = createdUser.identifier
    })

    afterAll(async () => await UserService.deleteOne(user.identifier as string))

    it('Authenticate method should return the authenticated user', async () => {
      const authenticatedUser = await UserService.authenticate(user)
      expect(authenticatedUser?.email).toBe(user.email)
      expect(authenticatedUser?.firstName).toBe(user.firstName)
      expect(authenticatedUser?.lastName).toBe(user.lastName)
    })

    it('Authenticate method should return null for wrong credentials', async () => {
      const authenticatedUser = await UserService.authenticate({
        email: 'abc-test@.com',
        password: 'fake-password',
      })
      expect(authenticatedUser).toBe(null)
    })
  })
})
