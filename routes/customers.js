// const auth = require('../services/auth');
const { auth, login, register, update } = require('../services/customers');

const router = require('express').Router();

router.put('/update', async (req, res) => {
    try
    {
        const response = await update(req); 
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error('Failed To Update Customer Details',err.message);
        return res.status(500).json('Authentication failed', err.message);
    }
});


router.get('/auth', async (req, res) => {
    try
    {
        const response = await auth(req); 
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error('Authentication failed',err.message);
        return res.status(500).json('Authentication failed', err.message);
    }
});


router.post('/login', async (req, res) => {
    try 
    {
        const response = await login(req);
        return res.status(200).json( response );
    } catch(err) 
    {
        console.error('Failed To login User', err.message);
        return res.status(500).json({ message: 'Login failed', error: err.message });
    }
});


router.post('/register', async (req, res) => {
    try 
    {
        const response = await register(req);
        return res.status(200).json( response );
    } catch(err) 
    {
        console.error('Failed To Register User', err.message);
        return res.status(500).json({ message: 'Registration failed', error: err.message });
    }
});

module.exports = { customersRouter: router };