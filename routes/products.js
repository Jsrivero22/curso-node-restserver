const { Router } = require('express');
const { check } = require('express-validator');

const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product');

const { existProductById, existProductByName } = require('../helpers/products/db-validators');

const {
    validateFields,
    validateJWT,
    isAdminRole
} = require('../middlewares');

const { existCategoryById } = require('../helpers/categories/db-validators');

const router = Router();

/*
 *   {{url}}/api/products
 */

router.get('/', [
    validateJWT,
], getProducts);



router.get('/:id', [
    validateJWT,
    check('id', 'Is not a valid id').isMongoId(),
    check('id').custom( existProductById ),
    validateFields
], getProduct);



router.post('/', [
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    check('name').custom( existProductByName ),
    check('category', 'The category is required').not().isEmpty(),
    check('category', 'Is not a valid id').isMongoId(),
    check('category').custom( existCategoryById ),
    validateFields
], createProduct);



router.put('/:id', [
    validateJWT,
    check('id', 'Is not a valid id').isMongoId(),
    check('id').custom( existProductById ),
    validateFields
], updateProduct);



/* Deleted Product - private - token validated - Is Admin */
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Is not a valid id').isMongoId(),
    check('id').custom( existProductById ),
    validateFields
], deleteProduct);





module.exports = router;