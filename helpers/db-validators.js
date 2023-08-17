const Role = require('../models/role');
const User = require('../models/user');

const isRoleValid = async (role = '') => {

    const issetRole = await Role.findOne({ role });

    if ( !issetRole ) {
        throw new Error(`El role ${ role } no esta registrado`);
    }
}

const existsEmail = async (email = '') => {

    const exists = await User.findOne({ email })
    if ( exists ) {
        throw new Error(`El email ${email} ya esta registrado`);
    }
}

const existsUserById = async id => {

    const existsUser = await User.findById( id )
    if ( !existsUser ) {
        throw new Error(`El id ${id} no existe`);
    }
}


module.exports = {
    isRoleValid,
    existsEmail,
    existsUserById,
}