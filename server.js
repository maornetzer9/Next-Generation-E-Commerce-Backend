// Required Routers
const { customersRouter } = require('./controllers/user');
const { productsRouter } = require('./controllers/products');
const { ordersRouter } = require('./controllers/orders');
const { cartRouter } = require('./controllers/cart');
const { adminOrders } = require('./controllers/admin');

// Required Packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

// Constant Data 
const PORT = 3000;
const app = express();
const ORIGIN = process.env.ORIGIN;
const MONGOOSE_URI = process.env.MONGOOSE_URI;
const corsOptions = { origin: ORIGIN, optionsSuccessStatus: 200 };
const timeZone = new Date().toLocaleString({timeZone: 'Asia/Jerusalem'});

// Middleware
app.use(cors( corsOptions ));
app.use( express.json() );
app.use( express.urlencoded({ extended: false }) );

// Routes
app.use('/customers', customersRouter);
app.use('/products',  productsRouter);
app.use('/orders',    ordersRouter);
app.use('/cart',      cartRouter);
app.use('/admin',     adminOrders);

// MongoDB Connection
mongoose.connect(MONGOOSE_URI)
.then(() => {
    const name = mongoose.connection.name;

    console.info({
        name,
        ORIGIN,
        connection: true
    })
})
.catch((err) => console.error('Error connecting to mongoDB', err));


app.listen(PORT, () => console.info(`Server is Running On Port : ${PORT} - timeZone: `, timeZone));