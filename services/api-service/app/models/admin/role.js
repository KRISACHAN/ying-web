import { sequelize } from '@services/db';
import { Model, DataTypes } from 'sequelize';

export class RoleModel extends Model {}

RoleModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        modelName: 'role',
        tableName: 'role',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
);
