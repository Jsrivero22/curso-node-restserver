const { request, response } = require("express")


const isAdminRole = ( req = request, res = response, next ) => {

    if ( !req.user ) {
        return res.status(500).json({
            message: 'Se requiere verificar el role sin validar el token primero'
        });
    }

    const { role, name } = req.user;

    console.log(role)

    if ( role !== 'ADMIN' ) {
        return res.status(401).json({
            message: `${ name } no es administrado - No puede hacer la eliminacion`
        });
    }

    req.user

    next();
}

const tieneRole = ( ...roles ) => {

    return ( req = request, res = response, next ) => {

        if ( !req.user ) {
            return res.status(500).json({
                message: 'Se requiere verificar el role sin validar el token primero'
            });
        }

        if ( !roles.includes( req.user.role ) ) {
            return res.status(401).json({
                message: `el servicio requiere uno de estos roles ${ roles }`
            });
        }

        next();
    }

}

module.exports = {
    isAdminRole,
    tieneRole,
}