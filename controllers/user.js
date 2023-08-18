const { response, request } = require('express');

const bcryptjs = require('bcryptjs');

const User = require('../models/user');


const userGet = async ( req = request, res = response ) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };

    const [ count_users, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
            .skip( Number(from) )
            .limit( Number(limit) ),
    ]);

    res.json({
        count_users,
        users
    });
}

const userPost = async ( req, res ) => {

    const { email, name, password, role } = req.body;
    const user = new User({ email, name, password, role });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password.toString(), salt );

    // Guardar en base de datos
    await user.save();

    res.status(201).json({
        user
    });

}

const userPut = async ( req, res ) => {

    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    // TODO validar contra base de datos
    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password.toString(), salt );
    }

    const user = await User.findByIdAndUpdate( id, rest, { new: true } );

    res.json({
        user
    });
}

const userPatch = ( req, res ) => {
    res.json({
        message: 'Patch API - controller - userPatch'
    });
}

const userDelete = async ( req, res ) => {

    const { id } = req.params;

    // Fisicamente lo borramos
    // const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id, { state: false }, { new: true });

    res.json( user );
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userPatch,
    userDelete
}