const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.SECRET_KEY;

const jwtUtils = {
    
    generateToken: function(payload, expiresIn = '1h')
    {
        const options = { expiresIn };
        return jwt.sign(payload, secretKey, options);
    },

    verifyToken: function(token)
    {
        try
        {
            return jwt.verify(token, secretKey);
        }
        catch(err)
        {
            console.error('Token verification failed:', err.message);
        }
    } 
}

module.exports = jwtUtils;