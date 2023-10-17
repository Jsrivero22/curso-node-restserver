const { response, request } = require("express");
const { Product } = require("../models");

const getProducts = async (req, res = response) => {

    try {

        const { limit = 5, from = 0 } = req.query;
        const query = { status: true };

        const [ total, products ] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                    .populate('user', 'name')
                    .populate('category', 'name')
                    .skip( Number(from) )
                    .limit( Number(limit) )
        ]);

        res.status(200).json({
            total,
            products
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Something went wrong, contact with the admin'
        });
    }

}

const getProduct = async (req = request, res = response) => {

    try {
        const { id } = req.params;

        const product = await Product.findById( id )
                                    .populate('user', 'name')
                                    .populate('category', 'name');

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            msg: 'Something went wrong, contact with the admin',
            error: error.message
        });
    }

}

const createProduct = async (req, res = response) => {

    try {
        const { status, user, ...body } = req.body;

        const productDB = await Product.findOne({ name: body.name });

        if ( productDB ) {
            return res.status(400).json({
                msg: `The product ${productDB.name}, already exist`
            });
        }

        const data = {
            ...body,
            name: body.name.toUpperCase(),
            user: req.user._id
        }

        const product = new Product( data );
        await product.save();

        res.status(201).json(product);

    } catch (error) {
        res.status(500).json({
            msg: 'Something went wrong, contact with the admin',
            error: error
        });
    }
}

const updateProduct = async (req, res = response) => {

    try {
        const { id } = req.params;
        const { status, user, ...data } = req.body;

        if ( data.name ) {
            data.name = data.name.toUpperCase();
        }

        data.user = req.user._id;

        const product = await Product.findByIdAndUpdate( id, data, { new: true } );

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            msg: 'Something went wrong, contact with the admin'
        });
    }
}

const deleteProduct = async (req, res = response) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndUpdate( id, { status: false }, { new: true } );

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            msg: 'Something went wrong, contact with the admin'
        });
    }
}




module.exports = {
    createProduct,
    deleteProduct,
    getProducts,
    getProduct,
    updateProduct
}