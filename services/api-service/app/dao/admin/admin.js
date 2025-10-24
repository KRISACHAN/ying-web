import { AdminModel } from '@models/admin/index';
import {
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    UNAUTHORIZED,
} from '@utils/http-errors';
import log from '@utils/log';
import bcrypt from 'bcryptjs';

export class AdminDao {
    static async create({ username, email, password }, transaction = null) {
        try {
            const admin = new AdminModel({ username, email, password });
            const savedAdmin = await admin.save({ transaction });

            if (!savedAdmin) {
                throw INTERNAL_SERVER_ERROR('创建管理员失败');
            }

            return savedAdmin;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async verify({ email, password }) {
        try {
            const admin = await AdminModel.findOne({
                where: { email },
            });

            if (!admin) {
                throw UNAUTHORIZED('账号不存在');
            }

            const isCorrectPassword = await bcrypt.compare(
                password,
                admin.password,
            );

            if (!isCorrectPassword) {
                throw UNAUTHORIZED('账号不存在或密码错误');
            }

            return admin;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async search(
        { email, id } = {
            email: null,
            id: null,
        },
    ) {
        try {
            const whereQuery = {};
            if (email) {
                whereQuery.email = email;
            }
            if (id) {
                whereQuery.id = id;
            }

            const admin = await AdminModel.scope('bh').findOne({
                where: whereQuery,
            });

            if (!admin) {
                throw NOT_FOUND('管理员不存在');
            }

            if (!admin.status) {
                throw FORBIDDEN('账号不可用');
            }

            return admin;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const admin = await AdminModel.scope('bh').findOne({
                where: { id },
            });

            if (!admin) {
                throw NOT_FOUND('管理员不存在');
            }

            return admin;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            return await AdminModel.scope('bh').findOne({
                where: { email },
            });
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async update(id, { email, password, username }, transaction = null) {
        try {
            const admin = await AdminModel.findOne({
                where: { id },
            });

            if (!admin) {
                throw NOT_FOUND('管理员不存在');
            }

            if (email) {
                admin.email = email;
            }

            if (password) {
                admin.password = password;
            }

            if (username) {
                admin.username = username;
            }

            const updatedAdmin = await admin.save({ transaction });

            if (!updatedAdmin) {
                throw INTERNAL_SERVER_ERROR('更新管理员失败');
            }

            return updatedAdmin;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async delete(id, transaction = null) {
        try {
            const admin = await AdminModel.findOne({
                where: { id },
            });

            if (!admin) {
                throw NOT_FOUND('管理员不存在');
            }

            const deletedAdmin = await admin.destroy({ transaction });

            if (!deletedAdmin) {
                throw INTERNAL_SERVER_ERROR('删除管理员失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async query({ pageNum = 1, pageSize = 10 }, ctx = null) {
        try {
            // Try to get total count from cache (if ctx.cache is available)
            let total = null;
            const cacheKey = `admin:list:count`;

            if (ctx && ctx.cache) {
                total = await ctx.cache.get(cacheKey);
            }

            if (!total) {
                total = await AdminModel.scope('bh').count();
                // Cache total count for 5 minutes
                if (ctx && ctx.cache) {
                    await ctx.cache.set(cacheKey, total, 300);
                }
            }

            const result = await AdminModel.scope('bh').findAll({
                offset: (pageNum - 1) * pageSize,
                limit: pageSize,
                order: [['id', 'DESC']],
            });

            if (!result) {
                throw INTERNAL_SERVER_ERROR('查询管理员列表失败');
            }

            return {
                pagination: {
                    count: pageNum,
                    size: pageSize,
                    total: total,
                },
                data: result,
            };
        } catch (error) {
            log.error(error);
            throw error;
        }
    }
}
