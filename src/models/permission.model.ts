import { Model, UUIDV4 } from 'sequelize'
import { PermissionAttributes } from '../types/permission.type'

export = (sequelize: any, DataTypes: any) => {
  class Permission
    extends Model<PermissionAttributes>
    implements PermissionAttributes
  {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    identifier!: string
    name!: string
    description!: string
  }

  Permission.init(
    {
      identifier: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Permission',
    }
  )

  return Permission
}
