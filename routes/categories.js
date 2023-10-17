const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');
const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categories');

const { existCategoryById } = require('../helpers/categories/db-validators');



const router = Router();

/*
 *   {{url}}/api/categories
 */

router.get('/', [
    validateJWT,
], getCategories);



router.get('/:id', [
    validateJWT,
    check('id', 'The id is not valid').isMongoId(),
    check('id').custom( existCategoryById ),
    validateFields
], getCategory);



router.post('/', [
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    validateFields
], createCategory);



router.put('/:id', [
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    check('id', 'The id is not valid').isMongoId(),
    check('id').custom( existCategoryById ),
    validateFields
], updateCategory);



/* Deleted Category - private - token validated - Is Admin */
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'The id is not valid').isMongoId(),
    check('id').custom( existCategoryById ),
    validateFields
], deleteCategory);







module.exports = router
