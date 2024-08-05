const express = require('express');
const {
  getAllCalenderTask,
  createCalenderTask,
  deleteCalenderTask,
  updateCalenderTask,
  analizedCalenderTasks,
} = require('../controllers/calender');

const Router = express.Router();

Router.get('/', getAllCalenderTask);
Router.get('/analizedData', analizedCalenderTasks);

Router.post('/', createCalenderTask);
Router.delete('/:id', deleteCalenderTask);
Router.patch('/:id', updateCalenderTask);

module.exports = Router;
