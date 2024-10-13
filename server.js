
// Required Packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongooseConnection = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
dotenv.config();

mongooseConnection(err => { if(err) console.error('Could not connect to database') });

// Required Routers
const { userRouter } = require('./routes/user');
const { productsRouter } = require('./routes/products');
const { cartRouter } = require('./routes/cart');
const { ordersRouter } = require('./routes/orders');
const { adminRouter } = require('./routes/admin');


// Constant Data 
const PORT = 3000;
const app = express();
const ORIGIN = process.env.ORIGIN;
const corsOptions = { origin: ORIGIN, optionsSuccessStatus: 200 };
const timeZone = new Date().toLocaleString({timeZone: 'Asia/Jerusalem'});

// Middleware
app.use(cors( corsOptions ));
app.use( express.json() );
app.use( express.urlencoded({ extended: false }) );

// Routes
app.use('/user',      userRouter);
app.use('/products',  productsRouter);
app.use('/orders',    ordersRouter);
app.use('/cart',      cartRouter);
app.use('/admin',     adminRouter);
app.use(errorHandler);

// MongoDB Connection

app.listen(PORT, () => console.info(`Server is Running On Port : ${PORT} - timeZone: `, timeZone));