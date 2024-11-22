import { AdminModel } from '@models/admin/admin';
import {
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    PRECONDITION_FAILED,
    UNAUTHORIZED,
} from '@utils/http-errors';
import bcrypt from 'bcryptjs';

export class AdminDao {
    static async create({ username, email, password }) {
        const existedAdmin = await AdminModel.findOne({
            where: { email, deleted_at: null },
        });

        if (existedAdmin) {
            throw PRECONDITION_FAILED('管理员已存在');
        }

        const admin = new AdminModel({ username, email, password });
        const savedAdmin = await admin.save();

        if (!savedAdmin) {
            throw INTERNAL_SERVER_ERROR('创建管理员失败');
        }

        return true;
    }

    static async verify({ email, password }) {
        const admin = await AdminModel.findOne({
            where: { email, deleted_at: null },
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
    }

    static async search({ email, id }) {
        const whereQuery = {
            deleted_at: null,
        };
        if (email) {
            whereQuery.email = email;
        }
        if (id) {
            whereQuery.id = id;
        }
        const admin = await AdminModel.findOne({
            where: whereQuery,
        });

        if (!admin) {
            throw NOT_FOUND('管理员不存在');
        }

        if (!admin.status) {
            throw FORBIDDEN('账号不可用');
        }

        return admin;
    }

    static async update(id, { email, password, username }) {
        const admin = await AdminModel.findOne({
            where: { id, deleted_at: null },
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

        const updatedAdmin = await admin.save();

        if (!updatedAdmin) {
            throw INTERNAL_SERVER_ERROR('更新管理员失败');
        }

        return true;
    }

    static async delete(id) {
        const admin = await AdminModel.findOne({
            where: { id, deleted_at: null },
        });

        if (!admin) {
            throw NOT_FOUND('管理员不存在');
        }

        const deletedAdmin = await admin.destroy();

        if (!deletedAdmin) {
            throw INTERNAL_SERVER_ERROR('删除管理员失败');
        }

        return true;
    }

    static async query({ pageNum = 1, pageSize = 10 }) {
        const result = await AdminModel.findAndCountAll({
            where: { deleted_at: null },
            offset: (pageNum - 1) * pageSize,
            limit: pageSize,
            order: [['id', 'DESC']],
        });

        if (!result) {
            throw INTERNAL_SERVER_ERROR('查询管理员列表失败');
        }

        return {
            page: {
                count: pageNum,
                size: pageSize,
                total: result.count,
            },
            data: result.rows,
        };
    }
}
