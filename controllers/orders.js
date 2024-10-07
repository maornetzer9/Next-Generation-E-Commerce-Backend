const { newOrder, loadOrders } = require('../services/orders');

const router = require('express').Router();


router.get('/', async (req, res) => {
    try
    {
        const response = await loadOrders(req); 
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error('Authentication failed',err);
        return res.status(500).json('Authentication failed', err.message);
    }
})

router.post('/add', async (req, res) => {
    try
    {
        const response = await newOrder(req);
        return res.status(200).json(response);

    }
    catch(error)
    {
        console.error('Failed To Add New Order', error.message);
        return res.status(500).json({ error: err.message, message: 'Internal Server Error' });
        
    }
});


module.exports = { ordersRouter: router };