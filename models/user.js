const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El passowrd es obligatorio']
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'USER', 'SALES']
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

/* Retorno de la data a responder */
UserSchema.methods.toJSON = function () {
    const { __v, password, ...user } = this.toObject();
    return user;
}



module.exports = model( 'User', UserSchema );