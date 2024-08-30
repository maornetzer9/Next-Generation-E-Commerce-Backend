const Products = require("../models/products");
const { User } = require("../models/user");
const israelTime = require("../utils/dateFormat");

const loadOrders = async (req) => {
    try
    {
        const { _id } = req.query;
        
        let user = await User.findOne({ _id }).select('-password');
        if( !user ) return { code: 400, message: 'User Not Found' };
        
        const users = await User.find({ checked: true, _id: { $ne: _id }}).select('-password');
        if( !users ) return { code: 400, message: 'Users Not Found' };
        
        return { code: 200, user, users, };
    }
    catch(err)
    {
        console.error('Failed To Load Users Orders', err.message);
        return { code: 500, message: err.message };
        
    }
};


const newOrder = async (req) => {
    try 
    {
        const { id } = req.body;
        let user = await User.findOne({ _id: id });
        if (!user) return { code: 404, message: 'User Not Found' };

        // Step 1: Check stock availability for all items in the cart
        for (const item of user.cart.items) 
        {
            const product = await Products.findOne({ id: item.id });
            if (!product) return { code: 404, message: `Product Not Found` };
            if (item.quantity > product.stock) return { code: 400, message: 'Stock Is Not Available' };
        }

        // Step 2: Process the order since stock is available for all items
        await Promise.all(
            user.cart.items.map(async (item) => {
                const product = await Products.findOne({ id: item.id });
                const index = user.orders.findIndex(order => order.id === item.id);

                const total = parseFloat(product.price) * item.quantity;

                const purchase = {
                    name: user.firstName,
                    quantity: item.quantity, 
                    date: israelTime,
                };
                
                if (index !== -1) 
                {
                    user.orders[index].quantity += item.quantity;
                    user.orders[index].total += total;
                } 
                else 
                {
                    user.orders.push({
                        ...item,
                        id: item.id,
                        title: product.title,
                        fullName: `${user.firstName} ${user.lastName}`,
                        joinedAt: user.createAt,
                        quantity: item.quantity,
                        category: item.category,
                        thumbnail: product.thumbnail,
                        price: product.price,
                        total,
                    });
                }

                await Products.findOneAndUpdate(
                    { id: item.id },
                    { 
                        $inc: { stock: -item.quantity, bought: +item.quantity }, 
                        $push: { purchases: purchase }
                    },
                    { new: true }
                );

                return null;
            })
        );

        // Step 3: Clear the user's cart and save the user data
        user.cart = { total: "0", items: [] };
        await user.save();

        return { code: 200, orders: user.orders, cart: user.cart };
    } 
    catch(err) 
    {
        console.error('Failed To Add New Order', err.message);
        return { code: 500, message: err.message };
    }
};

module.exports = { newOrder, loadOrders };
