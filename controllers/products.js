const { loadProducts, modifyProduct, updateCategories, deleteCategories, createCategories } = require('../services/products');

const router = require('express').Router();

router.get('/', async (req, res) => {
    try
    {
        const response = await loadProducts(req);
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error('Failed To Load Products', err.message);
        return res.status(500).json('Failed To Load Products');
        
    }
});


router.put('/modify', async (req, res) => {
    try
    {
        const response = await modifyProduct(req);
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error('Failed To Edit Products', err.message);
        return res.status(500).json('Failed To Edit Products');
        
    }
});


router.put('/update', async (req, res) => {
    try
    {
        const response = await updateCategories(req);
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error('Failed To Update Category', err.message);
        return res.status(500).json('Failed To Update Category');
        
    }
});


router.delete('/delete', async (req, res) => {
    try
    {
        const response = await deleteCategories(req);
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error('Failed To Delete Category', err.message);
        return res.status(500).json('Failed To Delete Category');
        
    }
});


router.post('/create', async (req, res) => {
    try
    {
        const response = await createCategories(req);
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error('Failed To Create Category', err.message);
        return res.status(500).json('Failed To Create Category');
        
    }
});

module.exports = { productsRouter: router };