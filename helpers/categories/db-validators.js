const Category = require('../../models/category');

const existCategoryById = async (id = '') => {

    const category = await Category.findById( id );

    if ( !category ) {
        throw new Error(`The id ${id} doesn't exist`);
    }
}

module.exports = {
    existCategoryById,
}