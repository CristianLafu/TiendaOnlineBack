const jwt = require('jsonwebtoken');

const Product = require('../models/product.model')
const User = require('../models/user.model')

const validate = (validationSchema) => {
    return async (req, res, next) => {
        try {
            await validationSchema.validate(req.body, { abortEarly: false });
            next();
        } catch (error) {
            res.json(error);
        }
    }
}


const checkRole = (req, res, next) => {
    return (req, res, next) => {
        if (req.user.role === role) {
            return next();
        }
        res.json({ fatal: ' No puedes pasar'});
    }
}

const checkToken = async (req, res, next) => {
    if ( !req.headers.authorization ) {
        return res.status(401).json ({ fatal: 'Debes incluir el Token de autentificacion'});
    }

    const token = req.headers.authorization;

    let obj;
    try {
        obj = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        console.log(error)
        return res.status(401).json({ fatal: 'El token es incorrecto' });
    }
     
    const user = await User.findById(obj.id);
    
    // Si atravieso el middleware dispongo del valor de req.user con los datos del usuario logado
    req.user = user;

    next();
}

const checkProduct = async (req, res, next) => {
    try {
        const productId = req.body.product_id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(400).json({ error: 'Producto no existe' });
        }

        next();
    } catch (error) {
        res.status(400).json({ error: 'Producto no existe' });
    }
};

module.exports = { validate, checkRole, checkToken, checkProduct };