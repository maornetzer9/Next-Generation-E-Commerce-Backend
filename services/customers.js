const { User } = require("../models/user");
const { compareHash } = require("../utils/bcrypt");
const { generateToken, verifyToken } = require("../utils/jwt");
const jwtUtils = require("../utils/jwt");


const auth = async (req) => {
    try 
    {
        const token = req.headers.authorization?.split(' ')[1];
        const userVerification = jwtUtils.verifyToken(token);
        
        if (!userVerification) return { code: 3, message: 'Failed to verify user' };

        const { _id } = userVerification.user;

        const verifyUser = await User.findOneAndUpdate(
            { _id },
            { $set: { isAuth: true } },
            { new: true }
        );

        if (!verifyUser) return { code: 3, message: 'User not found' };

        verifyUser.isAuth = true;
        
        // Convert Mongoose document to plain JavaScript object
        const userObject = verifyUser.toObject();

        // Remove the password field
        delete userObject.password;

        return {
            code: 200,
            user: userObject,
            isAuthenticated: userObject.isAuth,
        };
    } 
    catch (err) 
    {
        console.error('Failed to verify user.', err.message);
        return { code: 500, message: 'Failed to verify user.' };
    }
};


const login = async (req) => {
    try 
    {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return { code: 2, message: 'User not found.' };

        const comparePassword = compareHash(password, user.password);

        if (!comparePassword) return { code: 2, message: 'Incorrect password' };

        let token = user.token;
        // Verify existing token
        let isValidUserToken = token ? verifyToken(token) : false;

        if (!isValidUserToken) 
        {
            // Generate a new token if the current token is invalid
            token = generateToken({ user });
            user.token = token;
            await user.save();
        } 
        else 
        {
            // If the token is valid, extract the user from it
            isValidUserToken = verifyToken(token);
        }

        // Clean up user data before returning it (remove password)
        const userResponse = { ...user._doc };
        delete userResponse.password;

        return { code: 200, user: userResponse };
    } 
    catch (err) 
    {
        console.error('Failed To Register User', err);
        return { code: 500, message: 'Internal Server Error' };
        
    }
}


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
        console.error('Failed To Register User', err);
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
        console.error('Failed To Update Customer Details', err.message);
        return { code: 500, message: 'Internal Server Error' };
    }
};


module.exports = { auth, login, register, update };