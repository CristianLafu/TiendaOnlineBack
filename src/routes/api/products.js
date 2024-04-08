const router = require('express').Router();

const User = require('../../models/user.model');
const Product = require('../../models/product.model');
const { validate, checkProduct } = require('../../helpers/middlewares');
const productSchema = require('../../schemas/product.schema');

router.get('/', async (req, res) => {
    const products = await Product.find()
    res.json(products);
});

router.get('/price/:minPrice/max/:maxPrice', async (req, res) => {
    const { minPrice, maxPrice } = req.params;

    const products = await Product.find({
        price: { $gt: minPrice, $lt: maxPrice }
    });
    res.json(products);
});

router.get('/activos', async (req, res) => {
    try {
        const products = await Product.find({
            available: true,
            stock: { $gte: 10 }
        })
        res.json(products);
    } catch (error) {
        res.json({ fatal: error.message })
    }
});

router.get('/:department', async (req, res) => {
    const { department } = req.params;

    try {
        const products = await Product.find({ department: department });

        res.json(products);
    } catch (error) {
        res.json({ fatal: error.message })
    }
});

router.post('/', validate(productSchema), async (req, res) => {
    // req.body: name, description, price, department, available, stock
    const newProduct = await Product.create(req.body);
    res.json(newProduct);

});

router.put('/add_cart', checkProduct, async (req, res) => {
    console.log(req.body.product_id);
    console.log(req.user._id);
    //Recupero el usuario por ID y actualizo su prodiedad cart
    const user = await User.findByIdAndUpdate(req.user._id, {
        $push: { cart: req.body.product_id }
    }, { new: true } )

    res.json(user);
});

router.put('/:productId', async (req, res) => {
    const {productId} = req.params;
    
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
    res.json(updatedProduct);

});



router.delete('/:productId', async (req, res) => {
    const {productId} = req.params;

    const deletedProduct = await Product.findByIdAndDelete(productId);
    res.json(deletedProduct);
});





module.exports = router;