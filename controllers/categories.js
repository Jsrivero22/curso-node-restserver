const { response, request } = require("express");
const { Category } = require("../models");

const getCategories = async (req, res = response) => {

    try {

        const { limit = 5, from = 0 } = req.query;
        const query = { status: true };

        const [ total, categories ] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                    .populate('user', 'name')
                    .skip( Number(from) )
                    .limit( Number(limit) )
        ]);

        res.status(200).json({
            total,
            categories
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Something went wrong, contact with the admin'
        });
    }

}

const getCategory = async (req = request, res = response) => {

    try {
        const { id } = req.params;

        const category = await Category.findById( id )
                                        .populate('user', 'name');

        res.status(200).json(category);

    } catch (error) {
        res.status(500).json({
            msg: 'Something went wrong, contact with the admin',
            error: error.message
        });
    }

}

const createCategory = async (req, res = response) => {

    try {
        const name = req.body.name.toUpperCase();

        const categoryDB = await Category.findOne({ name });

        if ( categoryDB ) {
            return res.status(400).json({
                msg: `The category ${categoryDB.name}, already exist`
            });
        }

        const data = {
            name,
            user: req.user._id
        }

        const category = new Category( data );
        await category.save();

        res.status(201).json(category);

    } catch (error) {
        res.status(500).json({
            msg: 'Something went wrong, contact with the admin'
        });
    }
}

const updateCategory = async (req, res = response) => {

    try {
        const { id } = req.params;
        const { status, user, ...data } = req.body;

        data.name = data.name.toUpperCase();
        data.user = req.user._id;

        const category = await Category.findByIdAndUpdate( id, data, { new: true } );

        res.status(200).json(category);

    } catch (error) {
        res.status(500).json({
            msg: 'Something went wrong, contact with the admin'
        });
    }
}

// Delete Category - state: false

const deleteCategory = async (req, res = response) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndUpdate( id, { status: false }, { new: true } );

        res.status(200).json(category);

    } catch (error) {
        res.status(500).json({
            msg: 'Something went wrong, contact with the admin'
        });
    }
}




module.exports = {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory
}