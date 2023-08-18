const { response, request } = require('express');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async ( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            message: 'No hay token en la peticion'
        });
    }

    try {

        const { uid } = jsonwebtoken.verify( token, process.env.SECRETORPRIVATEKEY );

        // leer el usuario que corresponde al uid 
        const user = await User.findOne({ _id: uid });

        if ( !user ) {
            return res.status(401).json({
                message: 'Token no valido - usuario no existe en DB'
            });
        }

        // Verificar si el uid tiene state in true
        if ( !user.state ) {
            return res.status(401).json({
                message: 'Token no valido - usuario con estado: false'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Token no valido'
        })
    }
}

module.exports = {
    validateJWT,
}