const express = require('express');
const connectDB = require('./db/connect');
const cors = require('cors');
const CalenderRouter = require('./routes/calender');
const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());

app.use('/Calender/api/v1', CalenderRouter);

const start = () => {
  try {
    app.listen(5000, async () => {
      await connectDB();
      console.log('app lisiten to port 5000');
    });
  } catch (error) {
    console.log(error);
  }
};

start();
