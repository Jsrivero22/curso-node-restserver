const { Router } = require('express');
const { check } = require('express-validator');

const {
    validateFields,
    validateJWT,
    isAdminRole,
    tieneRole
} = require('../middlewares');

const { isRoleValid, existsEmail, existsUserById } = require('../helpers/db-validators');

const {
    userGet,
    userPost,
    userPut,
    userPatch,
    userDelete
} = require('../controllers/user');

const router = Router();


router.get('/', userGet);

router.post('/', [
    check('name', 'El name es obligatorio').not().isEmpty(),
    check('email', 'El email no es valido').isEmail(),
    check('email').custom( existsEmail ),
    check('password', 'El password es obligatorio y mas de 6 caracteres').isLength({ min: 6 }),
    check('role').custom( isRoleValid ),
    validateFields
], userPost);

router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existsUserById ),
    check('role').custom( isRoleValid ),
    validateFields

], userPut);

router.patch('/', userPatch);

router.delete('/:id', [
    validateJWT,
    // isAdminRole,
    tieneRole('ADMIN', 'SALES'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existsUserById ),
    validateFields
], userDelete);


module.exports = router;