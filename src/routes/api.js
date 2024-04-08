// Creación y configuración de la APP de Express
const router = require('express').Router();
const { checkToken } = require('../helpers/middlewares')

router.use('/products',checkToken, require('./api/products'));
router.use('/users', require('./api/users'));


module.exports = router;