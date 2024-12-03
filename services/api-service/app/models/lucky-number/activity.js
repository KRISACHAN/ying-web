import { sequelize } from '@services/db';
import { LUCKY_NUMBER_STATUS } from '@utils/constants';
import { DataTypes, Model } from 'sequelize';

export class ActivityModel extends Model {}

ActivityModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        participant_limit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.ENUM(
                LUCKY_NUMBER_STATUS.NOT_STARTED,
                LUCKY_NUMBER_STATUS.ONGOING,
                LUCKY_NUMBER_STATUS.ENDED,
            ),
            allowNull: false,
            defaultValue: LUCKY_NUMBER_STATUS.NOT_STARTED,
        },
    },
    {
        sequelize,
        modelName: 'lucky_number_activity',
        tableName: 'lucky_number_activity',
        timestamps: true,
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
);
