const Products = require("../models/products");
const { User } = require("../models/user");


const loadCart = async (req) => {
    try
    {
        const { userId } = req.body;

        const user = await User.findById({_id: userId});
        if( !user ) return { code: 400, message: 'No cart found for this user' };

        return { code: 200, cart: user.cart };
    }
    catch(err)
    {
        console.error('Error loading cart: ', err.message);
        return { code: 500, message: 'Internal server error' };
    }
        
};

const addToCart = async (req) => {
    try 
    {
        const { userId, product } = req.body;
        const { id, price } = product;
        
        const user = await User.findById(userId);
        if (!user) return { code: 404, message: 'User not found' };

        const isProductsExists = await Products.findOne({ id });
        if( !isProductsExists ) return { code: 404, message: 'Product not found' };
        
        const index = user.cart.items.findIndex((item) => item.id == id);

        if (index !== -1) 
        {
            if (isProductsExists.stock < 1) return { code: 400, message: 'Stock is not available' };
            user.cart.items[index].quantity++;

            const total = user.cart.items.reduce((sum, item) => sum += parseFloat(item.price) * item.quantity, 0);
            user.cart.total = total.toFixed(2);
            
            await user.save();
            return { code: 200, newProduct: user.cart.items[index], total: user.cart.total };
        } 
        else 
        {
             if (isProductsExists.stock - 1 === -1) return { code: 400, message: 'Stock is not available' };

            const newCartItem = {
                id: isProductsExists.id,
                title: isProductsExists.title,
                description: isProductsExists.description,
                category: isProductsExists.category,
                price: isProductsExists.price,
                rating: isProductsExists.rating,
                stock: isProductsExists.stock,  
                quantity: 1, 
                thumbnail: isProductsExists.thumbnail
            };

            let total = user.cart.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
            const totalPrice = total += price;
            
            user.cart.total = totalPrice.toFixed(2);
            user.cart.items.push(newCartItem);
            
            await user.save();
            return { code: 200, newProduct: newCartItem, total: user.cart.total};
        }
    } 
    catch(err) 
    {
        console.error('Error Adding Product To Cart:', err.message);
        return { code: 500, message: 'Internal server error' };
    }
};

const removeFromCart = async (req) => {
    try 
    {
        const { userId, product } = req.body;
        const { id } = product;
        
        const user = await User.findById(userId);
        if (!user) return { code: 404, message: 'User Not Found' };

        const index = user.cart.items.findIndex((item) => item.id == id);

        if (index !== -1) 
        {
            if (user.cart.items[index].quantity > 1) 
            {
                user.cart.items[index].quantity--;
            } 
            else 
            {
                user.cart.items.splice(index, 1); 
            }

            const total = user.cart.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
            user.cart.total = total.toFixed(2);

            await user.save();

            const updatedCartItems = user.cart.items.map(item => {
                const { _id, ...rest } = item.toObject(); 
                return rest;
            });
            
            return { code: 200, updatedProduct: updatedCartItems, total: user.cart.total };
        } 
        else 
        {
            return { code: 400, message: 'Product Not Found In The Cart' };
        }
    } 
    catch(err) 
    {
        console.error('Error Decreasing Quantity:', err.message);
        return { code: 500, message: 'Internal server error' };
    }
};

const deleteFromCart = async (req) => {
    try
    {
        const { id, _id } = req.body;

        const user = await User.findById({ _id })
        if( !user ) return { code: 400, message: 'User Not Found' };
        
        const userCartProduct = user.cart.items.find((item) => item.id === id);
        if( !userCartProduct ) return { code: 404, message: 'Product Not Found In Your Cart' }
        
        const filteredCart = user.cart.items.filter((item) => item.id !== userCartProduct.id);
        user.cart.items = filteredCart;

        const total = user.cart.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
        user.cart.total = total.toFixed(2);

        await user.save();

        return { code: 200, cart: user.cart.items, total };
    }
    catch(err)
    {
        console.error('Error To Remove The Product From The Cart:', err.message);
        return { code: 500, message: 'Internal Server Error' };
    }
};

module.exports = { loadCart, addToCart, removeFromCart, deleteFromCart };