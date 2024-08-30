const router = require('express').Router();
const { addToCart, loadCart, deleteFromCart, removeFromCart } = require('../services/cart');


router.post('/', async (req, res) => {
    try
    {
        const response = await loadCart(req);
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error('Failed to load product', err.message);
        return res.status(500).json('Failed to load product');
    }
})

router.post('/add', async (req, res) => {
    try
    {
        const response = await addToCart(req);
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error('Failed to add product', err.message);
        return res.status(500).json('Failed to add product');
    }
})

router.delete('/remove', async (req, res) => {
    try
    {
        const response = await removeFromCart(req);
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error('Failed To Remove Quantity', err.message);
        return res.status(500).json('Failed To Remove Quantity');
    }
})

router.delete('/delete', async (req, res) => {
    try
    {
        const response = await deleteFromCart(req);
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error('Failed to delete product', err.message);
        return res.status(500).json('Failed to delete product');
        
    }
})

module.exports = { cartRouter: router };