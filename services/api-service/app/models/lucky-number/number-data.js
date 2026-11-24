import { sequelize } from '@services/db';
import { DataTypes } from 'sequelize';

const integer = () => ({ type: DataTypes.INTEGER, allowNull: false });
const json = () => ({ type: DataTypes.JSON, allowNull: false });

export const NumberDataSchemaModel = sequelize.define(
    'lucky_number_data_schema',
    {
        activity_id: {
            ...integer(),
            primaryKey: true,
            references: { model: 'lucky_number_activity', key: 'id' },
        },
        columns_json: json(),
        revision: integer(),
    },
    { tableName: 'lucky_number_data_schema', paranoid: false },
);

export const NumberDataRowModel = sequelize.define(
    'lucky_number_data_row',
    {
        activity_id: {
            ...integer(),
            primaryKey: true,
            references: {
                model: 'lucky_number_data_schema',
                key: 'activity_id',
            },
        },
        drawn_number: { ...integer(), primaryKey: true },
        values_json: json(),
        version: integer(),
        updated_by: integer(),
    },
    { tableName: 'lucky_number_data_row', paranoid: false },
);
