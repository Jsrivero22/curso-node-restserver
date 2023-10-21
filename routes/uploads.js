const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateFileUpload } = require('../middlewares');

const { uploadFiles, updateFiles, showImage, updateFilesCloudinary } = require('../controllers/uploads');
const { collectionsAllowed } = require('../helpers');

const router = Router();


router.post('/', validateFileUpload, uploadFiles);

router.put('/:collection/:id', [
    validateFileUpload,
    check('id', 'Invalid ID').isMongoId(),
    check('collection').custom( c => collectionsAllowed( c, ['users', 'products'] ) ),
    validateFields
] , updateFilesCloudinary);
// ] , updateFiles);

router.get('/:collection/:id', [
    check('id', 'Invalid ID').isMongoId(),
    check('collection').custom( c => collectionsAllowed( c, ['users', 'products'] ) ),
    validateFields
] , showImage);


module.exports = router
