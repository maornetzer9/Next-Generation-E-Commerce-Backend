const { User } = require("../models/user");

const loadUsersOrders = async (req) => {
    try
    {
        const users = await User.find({});
        console.log();
        
        if( !users ) return { code: 404, message: 'Users not found' };

        return { code: 200, users };
    }
    catch(err)
    {
        console.error('Internal Server Error', err.message);
        return { code: 500, message: err.message };
    }
};


module.exports = { loadUsersOrders };