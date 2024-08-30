const axios = require('axios');
const Products = require('../models/products');
const { default: mongoose } = require('mongoose');

const loadProducts = async (req) => {
    try {
        const existingProducts = await Products.find();
        
        if ( existingProducts.length > 0 )  return { code: 200, products: existingProducts };

        const { data } = await axios.get('https://dummyjson.com/products');
        const { products } = data;

        const savedProducts = [];

        for ( let product of products ) 
        {
            const { id, title, description, category, price, rating, bought, stock, thumbnail } = product;
            const setProduct = { id, title, description, category, price, rating, stock, thumbnail, total: [] };

            await Products.updateOne(
                { id },              
                { $set: setProduct },
                { upsert: true }  
            );

            const savedProduct = await Products.findOne({ id });
            savedProducts.push(savedProduct); 
        }

        return { code: 200, products: savedProducts };
    } 
    catch (err) 
    {
        console.error('Error loading products:', err.message);
        return { code: 500, message: err.message };
    }
};


const modifyProduct = async (req) => {
    try
    {
        const { product } = req.body
         // Check if `_id` or `id` is null and handle accordingly.
         if (!product._id ) 
        {
            product._id = new mongoose.Types.ObjectId();

        // Find the product with the highest `id` and increment it to be inhibited.
            const lastProduct = await Products.findOne().sort({ id: -1 }).exec();
            const nextId = lastProduct ? lastProduct.id + 1 : 1;
            product.id = nextId;
        }

        const modifyProduct = await Products.findOneAndUpdate(
            {_id: product._id},
            { $set: product },
            { new: true, upsert: true }
        );
        
        if( !modifyProduct ) return { code: 404, message: 'Product Not Found' };

        return { code: 200, product: modifyProduct };
    }
    catch(err)
    {
        console.error('Internal Server Error', err.message);
        return { code: 500, message: err.message };
    }
};


const updateCategories = async (req) => {
    try
    {
        const { categories } = req.body;

        // Update the category of all products that match the old category
        const updateResult = await Products.updateMany(
            { category: categories.old },
            { $set: { category: categories.new } }
        );

        if (updateResult.nModified === 0) return { message: 'No products found with the specified category' };

        const updatedProducts = await Products.find({ category: categories.new });

        // Send the updated products to the frontend
        return { 
                code: 200, 
                updatedProducts, 
                oldCategory: categories.old
        }
    }
    catch(err)
    {
        console.error('Internal Server Error', err.message);
        return { code: 500, message: 'Internal Server Error' };
        
    }
};


const deleteCategories = async (req) => {
    try
    {
        const { category } = req.body;

        const deletedCategory = await Products.deleteMany({category});
        if( !deletedCategory.deletedCount === 0 ) return { code: 400,  message: 'Category Not Found'}; 

        return { 
            code: 200, 
            message: 'Category Deleted Successfully', 
            deletedCategory: category  
        };
    }
    catch(err)
    {
        console.error('Internal Server Error', err.message);
        return { code: 500, message: 'Internal Server Error' };
        
    }
};


const createCategories = async (req) => {
    try 
    {
        const { category } = req.body;

        // Ensure the category doesn't already exist
        const existingCategory = await Products.findOne({ category });
        if (existingCategory) return { code: 400, message: 'Category Already Exists' };

        // Create the new category (this could be a new document in a Categories collection)
        const newCategory = new Products({ category });
        const lastProduct = await Products.findOne().sort({ id: -1 }).exec();
        const nextId = lastProduct ? lastProduct.id + 1 : 1;
        newCategory.id = nextId;
        await newCategory.save();

        return{ code: 200, createdCategory: newCategory };
    } 
    catch(err) 
    {
        console.error('Internal Server Error', err.message);
        return { code: 500, message: 'Internal Server Error' };
    }
};



module.exports = { loadProducts, modifyProduct, updateCategories, deleteCategories, createCategories };
