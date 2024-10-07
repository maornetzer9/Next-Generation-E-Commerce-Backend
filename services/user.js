const { User } = require("../models/user");
const { compareHash } = require("../utils/bcrypt");
const { generateToken, verifyToken } = require("../utils/jwt");
const jwtUtils = require("../utils/jwt");


const auth = async (req) => {
    try 
    {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return { code: 401, message: 'No token provided.' };

        const userVerification = jwtUtils.verifyToken(token);
        if (userVerification == null) 
        {
            await User.findOneAndUpdate(
                { token },
                { $set: { isAuth: false, token: null } },
                { new: true }
            ); 
            return { code: 403, message: 'Invalid or expired token please reconnect.' };
        } 
        const { _id } = userVerification.user;

        const verifyUser = await User.findOneAndUpdate(
            { _id },
            { $set: { isAuth: true } },
            { new: true }
        );

        if (!verifyUser) return { code: 3, message: 'User not found' };

        // Convert Mongoose document to plain JavaScript object
        const userObject = verifyUser.toObject();

        // Remove the password field
        delete userObject.password;

        return {
            code: 200,
            user: userObject,
            isAuth: userObject.isAuth,
        };
    } 
    catch (err) 
    {
        console.error('Internal Server Error.', err.message);
        return { code: 500, message: 'Internal Server Error.'};
    }
};


const login = async (req) => {
    try 
    {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) return { code: 404, message: 'User not found.' };

        // Asynchronously compare the password
        const comparePassword = await compareHash(password, user.password);
        if (!comparePassword) return { code: 401, message: 'Incorrect password' };

        const token = generateToken({ user });
        user.token = token;
        await user.save();

        // Clean up user data before returning (remove sensitive fields like password)
        const userResponse = { ...user._doc };
        delete userResponse.password;
        
        // Return success response
        return { code: 200, user: userResponse, token };
    } 
    catch(err) 
    {
        console.error('Internal Server Error', err);
        return { code: 500, message: 'Internal Server Error'};
    }
};


const register = async (req) => {
    try
    {
        const { firstName, lastName, username, checked, password } = req.body;

        const isUserExists = await User.findOne({username});

        if(isUserExists) return {code: 1, message: 'Username already taken'};

        const user = await new User({ firstName, lastName, username, checked, password })
        await user.save();

        return { code: 200, user }
    }
    catch(err)
    {
        console.error('Internal Server Error', err);
        return { code: 500, message: 'Internal Server Error' };
    }
}


const update = async (req) => {
    try
    {
        const { form } = req.body;
        const { _id, firstName, lastName, username, password, checked } = form;

        let updateFields = { firstName, lastName, username, checked };

        const isUsernameExists = await User.findOne({username: username, _id: { $ne: _id }});
        if( isUsernameExists ) return { code: 404, message: 'Username Already Taken' };

        if (password && password.trim() !== "") 
        {
            updateFields.password = password;
        }

        const user = await User.findOneAndUpdate(
            {_id: _id},
            { $set: updateFields },
            { new: true }
        ).select('-password');

        if( !user ) return { code: 404, message: 'User Not Found' };

        return { code: 200, user, message: 'Customer Update Successfully' };
    }
    catch(err)
    {
        console.error('Internal Server Error', err.message);
        return { code: 500, message: 'Internal Server Error' };
    }
};


const disconnect = async (req) => {
    try 
    {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return { code: 401, message: 'Authorization token missing' };

        // Verify the token
        const userVerification = jwtUtils.verifyToken(token);
        if (!userVerification) return { code: 403, message: 'Invalid token' };

        const { _id } = userVerification.user;

        // Find the user and remove the token (or set it to null)
        const user = await User.findOneAndUpdate( 
            {_id},
            { $set: { isAuth: false, token: null } },
            { new: true }
        );

        if (!user) return { code: 404, message: 'User not found' };

        // Invalidate the token

        return { code: 200, message: 'User logged out successfully' };
    } 
    catch(err) 
    {
        console.error('Failed to log out user:', err.message);
        return { code: 500, message: 'Internal Server Error' };
    }
};


module.exports = { auth, login, register, update, disconnect };