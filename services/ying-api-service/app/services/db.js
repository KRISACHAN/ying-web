import Sequelize from 'sequelize';
import { get } from 'lodash';
import log from '@utils/log';
import { to } from 'await-to-js';

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        logging: false,
        timezone: '+08:00',
        define: {
            timestamps: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            underscored: true,
            scopes: {
                bh: {
                    attributes: {
                        exclude: [
                            'password',
                            'updated_at',
                            'deleted_at',
                            'created_at',
                        ],
                    },
                },
                df: {
                    attributes: {
                        exclude: ['updated_at', 'deleted_at', 'created_at'],
                    },
                },
            },
        },
    },
);

const initDb = async () => {
    if (process.env.CREATE_DATABASE === 'true') {
        await sequelize
            .query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)
            .then(() => {
                log.error('');
                log.verbose(`- Create database ${process.env.DB_NAME} success`);
            });
    }
    const force = process.env.CREATE_TABLE === 'true';
    if (force) {
        await import('@models/admin/index');
        await import('@models/lucky-number/index');
    }
    await sequelize.sync({ force });
    const [error] = await to(sequelize.authenticate());
    if (error) {
        log.error('');
        log.error('         DB running message:');
        log.error(
            `         - Netword: ${process.env.DB_HOST}:${process.env.DB_PORT}`,
        );
        log.error('         - Status: db connect fail');
        log.error(`         - Message: ${get(error, 'message', error)}`);
        return;
    }
    log.verbose('');
    log.verbose('        DB running message');
    log.verbose(
        `        - Netword: ${process.env.DB_HOST}:${process.env.DB_PORT}`,
    );
    if (force) {
        log.verbose(
            `         - Created Tables: ${Object.keys(sequelize.models).join(
                ', ',
            )}`,
        );
    }
    log.verbose('        - Status: db connect success');
    log.verbose('');
};

initDb().then(() => {
    if (process.env.CREATE_ADMIN === 'true') {
        import('../scripts/admin').then(({ default: { createAdmin } }) => {
            createAdmin();
        });
    }
});
