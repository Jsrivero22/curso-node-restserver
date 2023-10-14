const { response, json } = require("express");
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        // Vaerificar si el email existe
        if ( !user ) {
            return res.status(400).json({
                message: 'Usuario / Password no son correctos - correo'
            });
        }

        // Si el usuario esta activo
        if ( !user.state ) {
            return res.status(400).json({
                message: 'Usuario / Password no son correctos - status false'
            });
        }

        // Verificar la contraseña
        const validatePassword = bcryptjs.compareSync( password.toString(), user.password );
        if ( !validatePassword ) {
            return res.status(400).json({
                message: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Hable con el amdinistrador"
        });
    }

}

const googleSignIn = async ( req, res = response ) => {

    const { id_token } = req.body;

    try {
        const { name, image, email } = await googleVerify( id_token );

        let user = await User.findOne({ email });

        if ( !user ) {
            const data = {
                name,
                email,
                password: ':P',
                image,
                role: "USER",
                google: true
            };

            user = new User( data );
            // console.log(user);
            await user.save();
        }

        // console.log(user);

        // Si el user en DB
        if ( !user.state ) {
            return res.status(401).json({
                message: 'Speak with the admin, user blocked'
            });
        }

        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });
    } catch (error) {
        res.status(400).json({
            message: 'Google token not is valid',
            ok: false
        });
    }

}


module.exports = {
    login,
    googleSignIn,
}