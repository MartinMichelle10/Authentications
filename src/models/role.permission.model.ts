import { Model, UUIDV4 } from 'sequelize'
import { RolePermissionAttributes } from '../types/role-permission.type'

export = (sequelize: any, DataTypes: any) => {
  class RolePermission
    extends Model<RolePermissionAttributes>
    implements RolePermissionAttributes
  {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    identifier!: string
    roleId!: string
    permId!: string

    static associate(models: any) {
      RolePermission.belongsTo(models.Roles, {
        foreignKey: 'roleId',
        as: 'roles',
      })

      RolePermission.belongsTo(models.Permission, {
        foreignKey: 'permId',
        as: 'permission',
      })
    }
  }

  RolePermission.init(
    {
      identifier: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      permId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'RolePermission',
    }
  )

  return RolePermission
}
