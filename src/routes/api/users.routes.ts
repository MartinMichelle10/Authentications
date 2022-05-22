import { Router } from 'express'
import * as controllers from '../../controllers/users.controllers'
import authenticationMiddleware from '../../middleware/authentication.middleware'
import checkPermission from '../../middleware/permission.middleware'

const routes = Router()
// api/users
routes.route('/').post(controllers.create)
routes
  .route('/')
  .get(
    authenticationMiddleware,
    checkPermission('list_users'),
    controllers.getMany
  )
routes
  .route('/:id')
  .get(
    authenticationMiddleware,
    checkPermission('get_user'),
    controllers.getOne
  )
// authentication
routes.route('/authenticate').post(controllers.authenticate)
// refresh token
routes
  .route('/refresh-token')
  .post(authenticationMiddleware, controllers.refreshTokenOfUser)

routes.route('/log-out').put(authenticationMiddleware, controllers.logOut)

routes
  .route('/destroy-session')
  .put(
    authenticationMiddleware,
    checkPermission('destroy-sessions'),
    controllers.destroyAllSessions
  )

routes
  .route('/:id')
  .delete(
    authenticationMiddleware,
    checkPermission('delete_user'),
    controllers.deleteOne
  )

export default routes
