const { response } = require("express");

const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const collectionsPermitted = [
    'categories',
    'products',
    'roles',
    'users',
];

const searchUsers = async( term = '', res = response ) => {

    const isMongoId = ObjectId.isValid( term ); // TRUE

    if ( isMongoId ) {
        const user = await User.findById( term );
        return responseSearch( res, user );
    }

    const regex = new RegExp( term, 'i' );

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    });

    return responseSearch( res, users );
}

const searchProducts = async( term = '', res = response ) => {

    const isMongoId = ObjectId.isValid( term ); // TRUE

    if ( isMongoId ) {
        const product = await Product.findById( term )
                                    .populate('category', 'name');
        return responseSearch( res, product );
    }

    const regex = new RegExp( term, 'i' );

    const products = await Product.find({ name: regex, status: true })
                                    .populate('category', 'name');

    return responseSearch( res, products );
}

const searchCategories = async( term = '', res = response ) => {

    const isMongoId = ObjectId.isValid( term ); // TRUE

    if ( isMongoId ) {
        const category = await Category.findById( term );

        return responseSearch( res, category );
    }

    const regex = new RegExp( term, 'i' );

    const categories = await Category.find({ name: regex, status: true });

    return responseSearch( res, categories );
}

const responseSearch = ( res = response, results = [] ) => {
    res.status(200).json({
        results,
    });
}

const search = ( req, res = response ) => {

    const { collection, term } = req.params;

    if( !collectionsPermitted.includes( collection ) ) {
        return res.status(400).json({
            message: `The collection ${ collection } is not permitted`
        });
    }

    switch (collection) {

        case 'categories':
            searchCategories( term, res );
            break;
        case 'products':
            searchProducts( term, res );
            break;
        case 'users':
            searchUsers( term, res );
            break;

        default:
            res.status(500).json({
                message: 'This option is not implemented yet'
            });
            break;
    }
}




module.exports = {
    search
}