import { Sequelize, DataTypes } from 'sequelize'
import config from '../config'
import User from '../models/user.model'

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

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
