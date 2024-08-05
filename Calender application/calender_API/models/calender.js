const mongoose = require('mongoose');

const calenderSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },

  day: {
    type: String,
    trim: true,
  },
  month: {
    type: String,
    trim: true,
  },
  year: {
    type: String,
    trim: true,
  },

  taskCompleted: {
    type: Boolean,
    default: false,
    trim: true,
  },

  reminderTime: {
    type: Boolean,
    default: false,
    trim: true,
  },
  reminderHour: {
    type: Number,
    default: 'N/A',
    trim: true,
  },

  reminderMinute: {
    type: Number,
    default: 'N/A',
    trim: true,
  },
});

module.exports = mongoose.model('Calender', calenderSchema);
