import { sequelize } from '@services/db';
import { OPTION_DRAW_STATUS } from '@utils/constants';
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
        allow_duplicate_options: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        status: {
            type: DataTypes.ENUM(
                OPTION_DRAW_STATUS.NOT_STARTED,
                OPTION_DRAW_STATUS.ONGOING,
                OPTION_DRAW_STATUS.ENDED,
            ),
            allowNull: false,
            defaultValue: OPTION_DRAW_STATUS.NOT_STARTED,
        },
    },
    {
        sequelize,
        modelName: 'option_draw_activity',
        tableName: 'option_draw_activity',
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
        paranoid: true,
    },
);
