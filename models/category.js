
const { Schema, model } = require('mongoose');

const CategorySchema = Schema({

    name: {
        type: String,
        required: [true, 'The name is required'],
        unique: true
    },

    status: {
        type: Boolean,
        default: true,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

/* Retorno de la data a responder */
CategorySchema.methods.toJSON = function () {
    const { __v, status, ...data } = this.toObject();
    return data;
}


module.exports = model( 'Category', CategorySchema );