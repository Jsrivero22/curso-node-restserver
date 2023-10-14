const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');

const { login, googleSignIn } = require('../controllers/auth');


const router = Router();


router.post('/login', [
    check('email', 'El email is required').isEmail(),
    check('password', 'El password is required').not().isEmpty(),
    validateFields
], login);

router.post('/google', [
    check('id_token', 'id_token is required').not().isEmpty(),
    validateFields
], googleSignIn);


module.exports = router
