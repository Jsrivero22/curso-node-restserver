
const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'The rol is required']
    },
    status: {
        type: Boolean,
        default: true
    }
});


module.exports = model( 'Role', RoleSchema );