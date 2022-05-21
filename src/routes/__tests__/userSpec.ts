import supertest from 'supertest'
import app from '../../index'
import { UserAttributes } from '../../types/user.type'
import UserService from '../../service/user.service'

const request = supertest(app)
let token = ''

describe('User API Endpoints', () => {
  const user = {
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'test123',
  } as UserAttributes

  beforeAll(async () => {
    const createdUser = await UserService.create(user)
    user.identifier = createdUser.identifier
  })

  afterAll(async () => await UserService.deleteOne(user.identifier as string))

  describe('Test Authenticate methods', () => {
    it('should be able to authenticate to get token', async () => {
      const res = await request
        .post('/api/users/authenticate')
        .set('Content-type', 'application/json')
        .send({
          email: 'test@test.com',
          password: 'test123',
        })
      expect(res.status).toBe(200)
      const { identifier, email } = res.body.data.user
      const userToken = res.body.data.token
      expect(identifier).toBe(user.identifier)
      expect(email).toBe('test@test.com')
      token = userToken
    })

    it('should be failed to authenticate with wrong email', async () => {
      const res = await request
        .post('/api/users/authenticate')
        .set('Content-type', 'application/json')
        .send({
          email: 'wrong@email.com',
          password: 'test123',
        })
      expect(res.status).toBe(401)
    })
  })

  describe('Test CRUD API methods', () => {
    it('should create new user', async () => {
      const res = await request
        .post('/api/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'test255@test2.com',
          firstName: 'Test2',
          lastName: 'User2',
          password: 'test123',
        } as UserAttributes)
      expect(res.status).toBe(200)
      const { email, firstName, lastName, identifier } = res.body.data
      expect(email).toBe('test255@test2.com')
      expect(firstName).toBe('Test2')
      expect(lastName).toBe('User2')
      await UserService.deleteOne(identifier as string)
    })

    it('should get list of users', async () => {
      const res = await request
        .get('/api/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(res.body.data.length).toBe(2)
    })

    it('should get user info', async () => {
      const res = await request
        .get(`/api/users/${user.identifier}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(res.body.data.email).toBe('test@test.com')
    })
  })
})
