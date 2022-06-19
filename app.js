require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const paymentsRouter = require('./routes/payments');

const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

//@@@@@@@@@@@@@@@@@@@@@@@@@ MIDDLEWARE
app.use(express.json());

// routes
app.get('/', (req, res) => {
   res.send('<h1>BeFlow Payment</h1><a href="/payments">payments</a>');
});

// routes in router
app.use('/payments', paymentsRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

//@@@@@@@@@@@@@@@@@@@@@@@@@ APP.LISTEN

const port = process.env.PORT || 3000;

const startApp = async () => {
   try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, console.log(`Listening in port ${port}...👍`));
   } catch (error) {
      console.log(error);
   }
};

startApp();
