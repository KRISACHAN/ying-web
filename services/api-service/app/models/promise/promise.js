import { sequelize } from '@services/db';
import { DataTypes, Model } from 'sequelize';
import { CategoryModel } from './promise-category';

export class PromiseModel extends Model {}

PromiseModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: CategoryModel,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        category_name: {
            type: DataTypes.STRING(20),
            allowNull: false,
            references: {
                model: CategoryModel,
                key: 'name',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        chapter: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        text: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        resource_type: {
            type: DataTypes.ENUM('image', 'video', 'audio'),
            allowNull: true,
        },
        resource_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_published: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'promise',
        modelName: 'promise',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                fields: ['category_id'],
                name: 'idx_category',
            },
            {
                fields: ['category_name'],
                name: 'idx_category_name',
            },
            {
                fields: ['chapter'],
                name: 'idx_chapter',
            },
            {
                fields: ['is_published'],
                name: 'idx_published',
            },
        ],
    },
);
