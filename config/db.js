const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const ORIGIN = process.env.ORIGIN;
const MONGOOSE_URI = process.env.MONGOOSE_URI;

const mongooseConnection = (next) => mongoose.connect(MONGOOSE_URI)
.then(() => {
    const name = mongoose.connection.name;

    console.info({
        name,
        ORIGIN,
        connection: true
    })
})
.catch((err) => {
    console.error('Error connecting to mongoDB', err)
    if(next) next(err);
});


module.exports = mongooseConnection;