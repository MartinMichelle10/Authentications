import { Sequelize, DataTypes } from 'sequelize'
import config from '../config'
import User from '../models/user.model'
import Roles from '../models/roles.model'
import Permission from '../models/permission.model'
import RolePermission from '../models/role.permission.model'

const db: any = {}

const sequelize = new Sequelize(
  config.database as string,
  config.user as string,
  config.password,
  {
    host: config.host,
    port: parseInt(config.dbPort as string, 10),
    dialect: 'mysql',
  }
)

db.User = User(sequelize, DataTypes)
db.Roles = Roles(sequelize, DataTypes)
db.Permission = Permission(sequelize, DataTypes)
db.RolePermission = RolePermission(sequelize, DataTypes)

if (db.User.associate) {
  db.User.associate(db)
}

if (db.RolePermission.associate) {
  db.RolePermission.associate(db)
}

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
