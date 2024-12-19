import { PromiseModel } from './promise';
import { CategoryModel } from './promise-category';

CategoryModel.hasMany(PromiseModel, {
    foreignKey: 'category_id',
    as: 'promises',
});

PromiseModel.belongsTo(CategoryModel, {
    foreignKey: 'category_id',
    as: 'promise_category',
});

export { CategoryModel, PromiseModel };
