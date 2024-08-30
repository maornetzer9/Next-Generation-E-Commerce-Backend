const router = require('express').Router();
const { loadUsersOrders } = require('../services/adminOrders');


router.get('/customers', async (req, res) => {
    try
    {
        const response = await loadUsersOrders(req);
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error('Request Failed To Load User Orders', err.message);
        return res.status(500).json(err.message);
    }
});


module.exports = { adminOrders: router };