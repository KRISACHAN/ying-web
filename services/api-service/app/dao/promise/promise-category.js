import { CategoryModel } from '@models/promise';
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from '@utils/http-errors';
import log from '@utils/log';
import { isUndefined } from 'lodash';
import { Op } from 'sequelize';

export class PromiseCategoryDao {
    static async create({ name, description, is_published = false }) {
        try {
            const category = new CategoryModel({
                name,
                description,
                is_published,
            });

            const savedCategory = await category.save();

            if (!savedCategory) {
                throw INTERNAL_SERVER_ERROR('创建分类失败');
            }

            return savedCategory;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async update(id, { name, description, is_published }) {
        try {
            const category = await CategoryModel.findOne({
                where: { id },
            });

            if (!category) {
                throw NOT_FOUND('分类不存在');
            }

            if (name) {
                category.name = name;
            }
            if (description) {
                category.description = description;
            }
            if (!isUndefined(is_published)) {
                category.is_published = is_published;
            }

            const updatedCategory = await category.save();

            if (!updatedCategory) {
                throw INTERNAL_SERVER_ERROR('更新分类失败');
            }

            return updatedCategory;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async query({
        page_num = 1,
        page_size = 10,
        is_published,
        name,
        description,
        order = 'DESC',
    }) {
        try {
            const whereQuery = {};
            if (!isUndefined(is_published)) {
                whereQuery.is_published = is_published;
            }

            if (name) {
                whereQuery.name = {
                    [Op.like]: `%${name}%`,
                };
            }
            if (description) {
                whereQuery.description = {
                    [Op.like]: `%${description}%`,
                };
            }

            const result = await CategoryModel.findAndCountAll({
                where: whereQuery,
                offset: (page_num - 1) * page_size,
                limit: page_size,
                order: [['id', order]],
            });

            return {
                data: result.rows,
                pagination: {
                    count: page_num,
                    size: page_size,
                    total: result.count,
                },
            };
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async search(id, { is_published } = {}) {
        try {
            const whereQuery = {
                id,
            };
            if (!isUndefined(is_published)) {
                whereQuery.is_published = is_published;
            }

            const category = await CategoryModel.findOne({
                where: whereQuery,
            });

            if (!category) {
                throw NOT_FOUND('分类不存在');
            }

            return category;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            await CategoryModel.destroy({ where: { id } });
        } catch (error) {
            log.error(error);
            throw error;
        }
    }
}
