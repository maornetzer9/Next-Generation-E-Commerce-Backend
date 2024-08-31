// Required Packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

// Constant Data 
const PORT = 3000;
const app = express();
const ORIGIN = process.env.ORIGIN
const RENDER = process.env.RENDER
const MONGOOSE_URI = process.env.MONGOOSE
const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (origin) return callback(null, true);
  
      const allowedOrigins = [RENDER, ORIGIN]; // Add your allowed origins
  
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200
  };
const timeZone = new Date().toLocaleString({timeZone: 'Asia/Jerusalem'});

// Required Routers
const { customersRouter } = require('./routes/user');
const { productsRouter } = require('./routes/products');
const { ordersRouter } = require('./routes/orders');
const { cartRouter } = require('./routes/cart');
const { adminOrders } = require('./routes/adminOrders');

// Middleware
app.use(cors( corsOptions ));
app.use( express.json() );
app.use( express.urlencoded({ extended: false }) );

// Routes
app.use('/customers', customersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/cart', cartRouter);
app.use('/admin', adminOrders);

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