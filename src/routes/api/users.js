const router = require('express').Router();
const bcrypt = require('bcryptjs');


const User = require('../../models/user.model');
const { validate, checkToken } = require('../../helpers/middlewares');
const { createToken } = require('../../helpers/utils');
const registerSchema = require('../../schemas/register.schema');


router.get('/profile', checkToken, (req, res) => {
    res.json(req.user);
})

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        
        const usuario = await User.findById(req.params.Id).populate('cart');    
        res.json({ usuario });

    } catch (error) {
        res.json({ fatal: error.message });
    }
});




router.post('/register', validate(registerSchema), async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 12);

    try {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } catch (error) {
        console.log(error.errors)
    }
    
});


router.post('/login', async (req, res) => {
    //Body: email, password
    const { email, password } = req.body;

    // ¿Existe en la base de datos?
    const user = await User.findOne({ email });
    if(!user) {
        return res.status(403).json({ fatal: 'Error email y/o contraseña'});
    }

    // Comprobas si las password coinciden
    const iguales = bcrypt.compareSync(password, user.password);
    if(!iguales) {
        return res.status(403).json({ fatal: 'Error email y/o contraseña'});
    }
    
    res.json({
        message: 'Login correcto',
        token: createToken(user)
    });

});








module.exports = router;