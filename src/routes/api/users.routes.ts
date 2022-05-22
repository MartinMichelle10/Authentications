import { Router } from 'express'
import * as controllers from '../../controllers/users.controllers'
import authenticationMiddleware from '../../middleware/authentication.middleware'
import checkPermission from '../../middleware/permission.middleware'

const routes = Router()
// api/users

// authentication
/**
 * @swagger
 * /api/users/authenticate:
 *  post:
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *       schema:
 *         type: object
 *         properties:
 *            email:
 *              type: string
 *              example: 'admin-user@yahoo.com'
 *            password:
 *              type: string
 *              example: '12345Maa'
 *   responses:
 *       200:
 *           description: everything is ok
 *       400:
 *           description: bad request
 *       500:
 *           description: internal server error
 */
routes.route('/authenticate').post(controllers.authenticate)

// list system roles
/**
 * @swagger
 * /api/users/roles:
 *  get:
 *    summary: Use to request all Roles on the system
 *    responses:
 *      '200':
 *        description: A successful response
 */
routes.route('/roles').get(controllers.getAllRoles)

// create new user
/**
 * @swagger
 * /api/users:
 *  post:
 *   summary: Create new user
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *       schema:
 *         type: object
 *         properties:
 *            firstName:
 *              type: string
 *              example: 'first name'
 *            lastName:
 *              type: string
 *              example: 'lastname'
 *            roleId:
 *              type: string
 *              example: '546c929b-d929-11ec-9a79-5a0fd4bb0069'
 *            email:
 *              type: string
 *              example: 'admin2-user@yahoo.com'
 *            password:
 *              type: string
 *              example: '12345Maa'
 *   responses:
 *       200:
 *           description: everything is ok
 *       400:
 *           description: bad request
 *       500:
 *           description: internal server error
 */
routes.route('/').post(controllers.create)

// list all users
/**
 * @swagger
 * /api/users:
 *  get:
 *    description: Use to request all users on the system
 *    consumes:
 *      - application/json
 *    responses:
 *      '200':
 *        description: A successful response
 */
routes
  .route('/')
  .get(
    authenticationMiddleware,
    checkPermission('list_users'),
    controllers.getMany
  )

// get specific user
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: String ID of the user to get
 *     responses:
 *       '200':
 *         description: A successful response
 */
routes
  .route('/:id')
  .get(
    authenticationMiddleware,
    checkPermission('get_user'),
    controllers.getOne
  )

// refresh token to keep user session valid
/**
 * @swagger
 * /api/users/refresh-token:
 *  post:
 *   responses:
 *       200:
 *           description: everything is ok
 *       400:
 *           description: bad request
 *       500:
 *           description: internal server error
 */
routes
  .route('/refresh-token')
  .post(authenticationMiddleware, controllers.refreshTokenOfUser)

// log out user from the system
/**
 * @swagger
 * /api/users/log-out:
 *  put:
 *   responses:
 *       200:
 *           description: everything is ok
 *       400:
 *           description: bad request
 *       500:
 *           description: internal server error
 */
routes.route('/log-out').put(authenticationMiddleware, controllers.logOut)

// destroy all valid sessions
/**
 * @swagger
 * /api/users/destroy-session:
 *  put:
 *   responses:
 *       200:
 *           description: everything is ok
 *       400:
 *           description: bad request
 *       500:
 *           description: internal server error
 */
routes
  .route('/destroy-session')
  .put(
    authenticationMiddleware,
    checkPermission('destroy-sessions'),
    controllers.destroyAllSessions
  )

// delete user
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: delete a user by ID
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: String ID of the user to delete
 *     responses:
 *       '200':
 *         description: A successful response
 */
routes
  .route('/:id')
  .delete(
    authenticationMiddleware,
    checkPermission('delete_user'),
    controllers.deleteOne
  )

export default routes
