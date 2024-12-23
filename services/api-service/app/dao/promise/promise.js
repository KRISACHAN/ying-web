import { CategoryModel, PromiseModel } from '@models/promise';
import { sequelize } from '@services/db';
import {
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    PRECONDITION_FAILED,
} from '@utils/http-errors';
import log from '@utils/log';
import { get, isUndefined } from 'lodash';

export class PromiseDao {
    static async create({
        category_id,
        chapter,
        text,
        description,
        resource_type,
        resource_url,
        is_published = false,
    }) {
        try {
            const category = await CategoryModel.findOne({
                where: { id: category_id },
            });

            if (!category) {
                throw PRECONDITION_FAILED('分类不存在');
            }

            const promise = new PromiseModel({
                category_id,
                category_name: get(category, 'name'),
                chapter,
                text,
                description,
                resource_type,
                resource_url,
                is_published,
            });

            const savedPromise = await promise.save();

            if (!savedPromise) {
                throw INTERNAL_SERVER_ERROR('创建经文失败');
            }

            return savedPromise;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async update(
        id,
        {
            category_id,
            chapter,
            text,
            description,
            resource_type,
            resource_url,
            is_published,
        },
    ) {
        try {
            const promise = await PromiseModel.findOne({
                where: { id },
            });

            if (!promise) {
                throw NOT_FOUND('经文不存在');
            }

            if (category_id) {
                const category = await CategoryModel.findOne({
                    where: { id: category_id },
                });
                if (!category) {
                    throw PRECONDITION_FAILED('分类不存在');
                }
                promise.category_id = category_id;
                promise.category_name = get(category, 'name');
            }

            if (chapter) {
                promise.chapter = chapter;
            }
            if (text) {
                promise.text = text;
            }
            if (description) {
                promise.description = description;
            }
            if (resource_type) {
                promise.resource_type = resource_type;
            }
            if (resource_url) {
                promise.resource_url = resource_url;
            }
            if (!isUndefined(is_published)) {
                promise.is_published = is_published;
            }

            const updatedPromise = await promise.save();

            if (!updatedPromise) {
                throw INTERNAL_SERVER_ERROR('更新经文失败');
            }

            return updatedPromise;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async query({
        page_num = 1,
        page_size = 10,
        category_id,
        category_name,
        chapter,
        text,
        description,
        is_published,
        order = 'DESC',
    }) {
        try {
            const whereQuery = {};
            if (category_id) {
                whereQuery.category_id = category_id;
            }
            if (!isUndefined(is_published)) {
                whereQuery.is_published = is_published;
            }
            if (category_name) {
                whereQuery.category_name = category_name;
            }
            if (chapter) {
                whereQuery.chapter = chapter;
            }
            if (text) {
                whereQuery.text = text;
            }
            if (description) {
                whereQuery.description = description;
            }

            const result = await PromiseModel.findAndCountAll({
                attributes: [
                    'id',
                    'category_name',
                    'chapter',
                    'is_published',
                    'created_at',
                ],
                where: whereQuery,
                include: [
                    {
                        model: CategoryModel,
                        as: 'promise_category',
                        attributes: [],
                        required: false,
                        where: !isUndefined(is_published)
                            ? { is_published }
                            : undefined,
                    },
                ],
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

            const promise = await PromiseModel.findOne({
                where: whereQuery,
                include: [
                    {
                        model: CategoryModel,
                        as: 'promise_category',
                        attributes: ['name'],
                        where: !isUndefined(is_published)
                            ? { is_published }
                            : undefined,
                    },
                ],
            });

            if (!promise) {
                throw NOT_FOUND('经文不存在');
            }

            return promise;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async random({ category_id, is_published } = {}) {
        try {
            const whereQuery = {};
            if (!isUndefined(is_published)) {
                whereQuery.is_published = is_published;
            }
            if (category_id) {
                whereQuery.category_id = category_id;
            }

            const result = await PromiseModel.findOne({
                where: whereQuery,
                order: sequelize.random(),
                include: [
                    {
                        model: CategoryModel,
                        as: 'promise_category',
                        attributes: ['name'],
                        required: false,
                        where: !isUndefined(is_published)
                            ? { is_published }
                            : undefined,
                    },
                ],
            });

            if (!result) {
                return '';
            }

            return result;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            await PromiseModel.destroy({ where: { id } });
        } catch (error) {
            log.error(error);
            throw error;
        }
    }
}
