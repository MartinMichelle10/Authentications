import { NextFunction, Response } from 'express'
import Error from '../interfaces/error.interface'
import db from '../database'

const RolePermission = db.RolePermission
const Permission = db.Permission

const handleUnauthorizedError = (next: NextFunction) => {
  const error: Error = new Error('Forbidden, Please contact administrator')
  error.status = 403
  next(error)
}

const checkPermission =
  (permName: string) => (req: any, res: Response, next: NextFunction) => {
    try {
      const user = req.user

      if (!user) {
        handleUnauthorizedError(next)
      }

      const { roleId } = user

      Permission.findOne({
        where: {
          name: permName,
        },
      })
        .then((perm: any) => {
          RolePermission.findOne({
            where: {
              roleId,
              permId: perm.get('identifier'),
            },
          })
            .then((rolePermission: any) => {
              if (rolePermission) {
                next()
              } else {
                handleUnauthorizedError(next)
              }
            })
            .catch((error: Error) => {
              handleUnauthorizedError(next)
            })
        })
        .catch(() => {
          handleUnauthorizedError(next)
        })
    } catch (err) {
      handleUnauthorizedError(next)
    }
  }

export default checkPermission
