const { response } = require("express")


const validateFileUpload = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archive) {
        return res.status(400).json({ msg: 'No files were uploaded - validateFileUpload' });
    }

    next();
}


module.exports = {
    validateFileUpload,
}