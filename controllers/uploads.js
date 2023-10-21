const { response } = require("express");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { uploadFile } = require("../helpers");
const { Product, User } = require("../models");

const uploadFiles = async (req, res = response) => {

    try {
        const name = await uploadFile(req.files, undefined, 'images');
        res.json({ name });
    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const updateFiles = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `There is no user with the id ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `There is no product with the id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'I forgot to validate this' });
    }

    // Clear previous images
    if ( model.image ) {
        // Delete image from server
        const pathImage = path.join( __dirname, '../uploads', collection, model.image );

        console.log( pathImage);
        console.log(fs.existsSync( pathImage ));
        if ( fs.existsSync( pathImage ) ) {
            fs.unlinkSync( pathImage );
        }
    }

    const name = await uploadFile(req.files, undefined, collection);
    model.image = name;

    await model.save();

    res.json(model);
}

const showImage = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `There is no user with the id ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `There is no product with the id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'I forgot to validate this' });
    }

    // Clear previous images
    if ( model.image ) {
        // Delete image from server
        const pathImage = path.join( __dirname, '../uploads', collection, model.image );

        console.log( pathImage);
        console.log(fs.existsSync( pathImage ));
        if ( fs.existsSync( pathImage ) ) {
            return res.sendFile( pathImage );
        }
    }

    const pathImageNoImage = path.join( __dirname, '../assets/no-image.jpg' );

    res.sendFile( pathImageNoImage );
}


const updateFilesCloudinary = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `There is no user with the id ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `There is no product with the id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'I forgot to validate this' });
    }

    // Clear previous images
    if ( model.image ) {
        const nameArray = model.image.split('/');
        const name = nameArray[ nameArray.length - 1 ];
        const [ public_id ] = name.split('.');
        console.log(public_id);
        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archive;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    model.image = secure_url;

    await model.save();

    res.json(model);
}

module.exports = {
    uploadFiles,
    updateFiles,
    showImage,
    updateFilesCloudinary
}