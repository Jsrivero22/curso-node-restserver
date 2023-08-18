const { response } = require("express");
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require("../helpers/generate-jwt");


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


module.exports = {
    login,
}