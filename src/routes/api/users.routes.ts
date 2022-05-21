import { Router } from 'express'
import * as controllers from '../../controllers/users.controllers'
import authenticationMiddleware from '../../middleware/authentication.middleware'

const routes = Router()
// api/users
routes.route('/').post(controllers.create)
routes.route('/').get(authenticationMiddleware, controllers.getMany)
routes.route('/:id').get(authenticationMiddleware, controllers.getOne)
// authentication
routes.route('/authenticate').post(controllers.authenticate)
// refresh token
routes
  .route('/refresh-token')
  .post(authenticationMiddleware, controllers.refreshTokenOfUser)

export default routes
