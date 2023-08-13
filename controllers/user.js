const { response, request } = require('express');

const userGet = ( req = request, res = response ) => {

    const { q, name = 'No Name', apikey, page = 1, limit } = req.query;

    res.json({
        message: 'Get API - controller - userGet',
        q,
        name,
        apikey,
        page,
        limit
    });
}

const userPost = ( req, res ) => {

    const { name, age } = req.body;

    res.status(201).json({
        message: 'Post API - controller - userPost',
        name,
        age
    });
}

const userPut = ( req, res ) => {

    const { id } = req.params;

    res.json({
        message: 'Put API - controller - userPut',
        id
    });
}

const userPatch = ( req, res ) => {
    res.json({
        message: 'Patch API - controller - userPatch'
    });
}

const userDelete = ( req, res ) => {
    res.json({
        message: 'Delete API - controller - userDelete'
    });
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userPatch,
    userDelete
}