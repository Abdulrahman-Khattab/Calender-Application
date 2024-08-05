const Calender = require('../models/calender');
const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require('../errors');

const { StatusCodes } = require('http-status-codes');

const getAllCalenderTask = async (req, res) => {
  const { day, month, year, reminderTime } = req.query;
  const queryObject = {};

  if (day) {
    queryObject.day = day;
  }
  if (month) {
    queryObject.month = month;
  }

  if (year) {
    queryObject.year = year;
  }

  if (reminderTime) {
    queryObject.reminderTime = reminderTime;
  }

  const calenderTasks = await Calender.find(queryObject);

  res.status(StatusCodes.OK).json(calenderTasks);
};

const getSingleCalenderTask = async (req, res) => {
  const { day, month, year } = req.query;
  const queryObject = {};

  if (day) {
    queryObject.day = day;
  }
  if (month) {
    queryObject.month = month;
  }

  if (year) {
    queryObject.year = year;
  }

  const calenderTasks = await Calender.find(queryObject);
};

const deleteCalenderTask = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError('please provide ID');
  }

  const deletedCalenderTask = await Calender.findOneAndDelete({ _id: id });

  if (!deleteCalenderTask) {
    throw new NotFoundError('there is no such calender task in database');
  }

  res.status(StatusCodes.OK).json(deletedCalenderTask);
};

const updateCalenderTask = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError('please provide ID');
  }

  const updatedCalenderTask = await Calender.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCalenderTask) {
    throw new NotFoundError('there is no such calender task in database');
  }

  res.status(StatusCodes.OK).json(updatedCalenderTask);
};

const createCalenderTask = async (req, res) => {
  const { title, description, day, month, year } = req.body;

  if (!day) {
    throw new BadRequestError('please provide day');
  }
  if (!month) {
    throw new BadRequestError('please provide month');
  }
  if (!year) {
    throw new BadRequestError('please provide year');
  }

  if (!title) {
    throw new BadRequestError('please provide title');
  }

  if (!description) {
    throw new BadRequestError('please provide description');
  }

  const createdCalenderTask = await Calender.create(req.body);

  res.status(StatusCodes.OK).json(createdCalenderTask);
};

const analizedCalenderTasks = async (req, res) => {
  const { year } = req.query;

  const calenderTasks = await Calender.find({});
  if (!calenderTasks) {
    throw new NotFoundError('there is no items in database');
  }

  // Get information about the tasks for the entire database
  const totalTasksInDB = await Calender.countDocuments();
  const tasksCompletedInDB = await Calender.countDocuments({
    taskCompleted: true,
  });
  const tasksRemainingInDB = totalTasksInDB - tasksCompletedInDB;

  // Aggregate pipeline to get information about completed tasks in the entire database
  const completedTasksPipeline = [
    {
      $match: {
        taskCompleted: true,
      },
    },
    {
      $project: {
        _id: 0,
        title: 1, // Include only the title field in the output
      },
    },
  ];

  // Aggregate pipeline to get information about non-completed tasks in the entire database
  const nonCompletedTasksPipeline = [
    {
      $match: {
        taskCompleted: false,
      },
    },
    {
      $project: {
        _id: 0,
        title: 1, // Include only the title field in the output
      },
    },
  ];
  const completedTasks = await Calender.aggregate(completedTasksPipeline);
  const nonCompletedTasks = await Calender.aggregate(nonCompletedTasksPipeline);

  res
    .json({
      totalTasksInDB,
      tasksRemainingInDB,
      tasksCompletedInDB,
      completedTasks,
      nonCompletedTasks,
    })
    .status(StatusCodes.OK);
};

module.exports = {
  getAllCalenderTask,
  createCalenderTask,
  deleteCalenderTask,
  updateCalenderTask,
  analizedCalenderTasks,
};
