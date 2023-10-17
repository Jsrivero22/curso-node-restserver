const Product = require('../../models/product');

const existProductById = async (id = '') => {

    const product = await Product.findById( id );

    if ( !product ) {
        throw new Error(`The id ${id} doesn't exist`);
    }
}

const existProductByName = async (name = '') => {

    const product = await Product.find({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if ( product.length > 0 ) {
        throw new Error(`The name ${name} already exist`);
    }
}

module.exports = {
    existProductById,
    existProductByName,
}