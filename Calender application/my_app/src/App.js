import React, { useEffect, useState, useRef } from 'react';
import logo from './static_resource/logo3.png';
import {
  Typography,
  Button,
  Grid,
  Modal,
  Box,
  TextField,
  IconButton,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Draggable from 'react-draggable'; // Import Draggable component from react-draggable

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid transparent',
  borderRadius: '3%',

  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const style2 = {
  position: 'absolute',
  top: '50%',
  left: '83%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid transparent',
  borderRadius: '3%',
  minHeight: '83%',

  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modal, setModal] = useState(false);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [calenderData, setCalenderData] = useState([]);
  const [taskCompleted, setTaskCompleted] = useState(true);
  const [reminder, setReminder] = useState(false);
  const [reminderHour, setReminderHour] = useState(0);
  const [reminderMinute, setReminderMinute] = useState(0);
  const [value, setValue] = useState(dayjs());
  const [reminderTime, setReminderTime] = useState(null);
  const [timeValue, setTimeValue] = useState(dayjs());
  const [analizedDataCalender, setAnalizedDataCalender] = useState({});
  const [modal2, setModal2] = useState(false);
  const [loading, setLoading] = useState(true);
  const rootRef = useRef(null);
  // Analized data value

  const {
    totalTasksInDB,
    tasksRemainingInDB,
    tasksCompletedInDB,
    completedTasks,
    nonCompletedTasks,
  } = analizedDataCalender;

  // BACK-END REQUESTS

  const createTask = async () => {
    try {
      const createTaskURL = `http://localhost:5000/Calender/api/v1`;
      const response = await fetch(createTaskURL, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          day,
          month,
          year,
          title,
          description,
          reminderTime,
          reminderHour: timeValue.hour(),
          reminderMinute: timeValue.minute(),
        }),
      });

      if (response.ok) {
        console.log('Creating calendar task is successful');
        getAllCalenderTaskRequest(); // Refresh calendar data after adding a task
      } else {
        console.log('failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCalenderTaskRequest = async () => {
    try {
      const getAllTasksURL = `http://localhost:5000/Calender/api/v1`;
      const response = await fetch(getAllTasksURL, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setCalenderData(data);
        console.log('Getting calendar task is successful');
        console.log(data);
      } else {
        console.log('failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAnalizedDataRequest = async () => {
    try {
      const getAnalizedDataURL = `http://localhost:5000/Calender/api/v1/analizedData`;
      const response = await fetch(getAnalizedDataURL, {
        method: 'GET',
      });

      if (response.ok) {
        setLoading(true);
        const data = await response.json();
        setAnalizedDataCalender(data);
        console.log('Getting analized calendar tasks  is successful');
        console.log(data);
        setLoading(false);
      } else {
        console.log('failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAnalizedDataRequest();
  }, []);

  const updateCalenderTaskInformation = async (id) => {
    try {
      const updateTaskURL = `http://localhost:5000/Calender/api/v1/${id}`;
      const response = await fetch(updateTaskURL, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({ taskCompleted, reminderTime: false }),
      });

      if (response.ok) {
        console.log('Updating calendar task is successful');
        window.location.reload(); // Refresh page after updating a task
      } else {
        console.log('failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCalenderTaskRequest();
  }, []);

  const closeModal = () => {
    setModal(false);
  };

  const openModal = () => {
    setModal(true);
  };

  const closeModal2 = () => {
    setModal2(false);
  };

  const openModal2 = () => {
    setModal(true);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const getMonthName = (date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  };

  const getDayName = (date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = [];
    const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = dayOfWeekNames[currentDate.getDay()]; // Get day of the week name
      daysInMonth.push({ dayNumber: day, dayOfWeek });
    }

    return daysInMonth;
  };

  // REMINDER FUNCTIONALITY

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchReminderTasksRequest = async () => {
      try {
        const getAllTasksURL = `http://localhost:5000/Calender/api/v1?reminderTime=true`;
        const response = await fetch(getAllTasksURL, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.log('failed');
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchReminderTasksRequest();
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const now = dayjs();

      tasks.forEach((task) => {
        if (task.reminderTime === true) {
          // Construct reminder time based on reminderHour and reminderMinute
          const reminderTimee = dayjs()
            .set('year', parseInt(task.year))
            .set('month', monthNames.indexOf(task.month)) // dayjs months are 0-indexed
            .set('date', parseInt(task.day)) // dayjs uses 'date' for day of the month
            .set('hour', task.reminderHour)
            .set('minute', task.reminderMinute);
          console.log(reminderTimee.toString()); // This will log the full date-time string

          if (now.isAfter(reminderTimee)) {
            // Trigger alert message or any other action you want
            alert(`It's time to do the task: ${task.title}`);
          }
        }
      });
    };

    // Check reminders on initial render
    checkReminders();

    // Set up interval to check reminders every minute
    const reminderInterval = setInterval(() => {
      checkReminders();
    }, 300000); // Check every minute

    // Clean up interval on component unmount
    return () => clearInterval(reminderInterval);
  }, [tasks]);

  const renderCalendar = () => {
    const DaysOfMonthWithTheirNames = getDaysInMonth(currentDate);
    const dayName = getDayName(currentDate);

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const monthName = getMonthName(currentDate);
    const getCurrentYear = currentDate.getFullYear();

    const calendar = [];

    // Pre-filter tasks for each day of the month
    const filteredTasksByDay = {};
    for (let day = 1; day <= 31; day++) {
      // Assuming max days in a month is 31
      filteredTasksByDay[day] = calenderData.filter((item) => {
        return (
          day === parseInt(item.day) &&
          monthName === item.month &&
          getCurrentYear === parseInt(item.year)
        );
      });
    }

    return (
      <div>
        <Modal open={modal} onClose={closeModal}>
          <Box
            sx={{
              ...style,
              textAlign: 'center',
            }}
          >
            <Box>
              <IconButton
                disableRipple
                disableElevation
                onClick={() => {
                  closeModal();
                }}
                sx={{ background: 'none' }}
              >
                <CloseIcon
                  sx={{
                    marginLeft: '23.5rem',
                    ':hover': {
                      cursor: 'pointer',
                      borderRadius: '50%',
                      background: '#f1f3f4',
                    },
                    textAlign: 'right',
                  }}
                />
              </IconButton>
            </Box>
            <Box sx={{ width: '100%' }}>
              <TextField
                type='text'
                variant='standard'
                placeholder='Add Title'
                sx={{ width: '80%' }}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <TextField
                type='text'
                variant='outlined'
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                multiline
                placeholder='Description'
                sx={{ width: '80%', marginTop: '2rem' }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={reminderTime}
                    onChange={(e) => {
                      setReminderTime(e.target.checked);
                    }}
                    color='primary'
                  />
                }
                label='Set Reminder'
                sx={{
                  marginRight: '12rem',
                  marginTop: '1rem',
                }}
              />
              {reminderTime && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimeField
                      label='Reminder'
                      value={timeValue}
                      onChange={(timeValue) => setTimeValue(timeValue)}
                      format='HH:mm'
                      sx={{
                        marginRight: '1rem',
                        marginTop: '1rem',
                        width: '20%',
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                marginTop: '4rem',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography>{`${day} ${month} ${year}`}</Typography>
              <Button
                sx={{ textTransform: 'capitalize', fontWeight: '700' }}
                variant='contained'
                onClick={async () => {
                  await createTask();

                  closeModal();
                  window.location.reload();
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

        <Modal open={modal2} onClose={closeModal2} disableEnforceFocus>
          <Box
            sx={{
              ...style2,
              textAlign: 'center',
            }}
          >
            <IconButton
              disableRipple
              disableElevation
              onClick={() => {
                closeModal2();
              }}
              sx={{ background: 'none', marginTop: '-0.5rem' }}
            >
              <CloseIcon
                sx={{
                  marginLeft: '23.5rem',
                  ':hover': {
                    cursor: 'pointer',
                    borderRadius: '50%',
                    background: '#f1f3f4',
                  },
                  textAlign: 'right',
                }}
              />
            </IconButton>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                marginRight: '5rem',
              }}
            >
              <Box>
                {completedTasks.map((task) => {
                  return (
                    <Typography
                      sx={{
                        background: '#c6dafc',
                        color: '#8794aa',
                        textDecoration: 'line-through',
                        textAlign: 'left',
                        marginTop: '4px',
                        paddingLeft: '8px',
                        borderRadius: '5px',
                        width: '100%',
                        marginLeft: '0.5rem',
                      }}
                    >
                      {task.title}
                    </Typography>
                  );
                })}
              </Box>
              <Box>
                {nonCompletedTasks.map((task) => {
                  return (
                    <Typography
                      sx={{
                        background: '#4285F4',
                        color: 'white',
                        textAlign: 'left',
                        marginTop: '4px',
                        paddingLeft: '8px',
                        marginLeft: '4rem',
                        borderRadius: '5px',
                        width: '100%',
                      }}
                    >
                      {task.title}
                    </Typography>
                  );
                })}
              </Box>
            </Box>
            <Box display='flex' justifyContent='space-around' marginTop='12rem'>
              {' '}
              <Typography
                sx={{
                  textTransform: 'capitalize',
                  backgroundColor: '#c6dafc',
                  borderRadius: '25px',
                  width: '40%',
                }}
              >
                completed : {tasksCompletedInDB}
              </Typography>
              <Typography
                sx={{
                  textTransform: 'capitalize',
                  background: '#4285F4',
                  width: '40%',
                  color: '#fefefe',
                  borderRadius: '25px',
                }}
              >
                non completed : {tasksRemainingInDB}
              </Typography>
            </Box>
          </Box>
        </Modal>
        <br />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: '1.5rem',
            position: 'relative',
          }}
        >
          <Box display='flex'>
            <Box sx={{ marginTop: '-3px' }}>
              <Button
                disableRipple
                onClick={goToPreviousMonth}
                sx={{
                  ':hover': {
                    background: 'none',
                  },
                }}
              >
                {' '}
                <ArrowCircleUpIcon
                  sx={{
                    transform: 'rotate(270deg)',
                    fontSize: '25px',
                    color: 'black',
                    ':hover': {
                      backgroundColor: 'black',
                      color: 'white',
                      cursor: 'pointer',
                      borderRadius: '50%',
                    },
                  }}
                />
              </Button>
              <Button
                onClick={goToNextMonth}
                sx={{
                  ':hover': {
                    background: 'none',
                  },
                }}
                disableRipple
              >
                <ArrowCircleUpIcon
                  sx={{
                    transform: 'rotate(90deg)',
                    fontSize: '25px',
                    color: 'black',
                    ':hover': {
                      backgroundColor: 'black',
                      color: 'white',
                      cursor: 'pointer',
                      borderRadius: '50%',
                    },
                  }}
                />
              </Button>
            </Box>
            <Typography variant='h5' gutterBottom>
              {monthName} {getCurrentYear}
            </Typography>
          </Box>
          <Box sx={{ width: '60%', marginTop: '-16px', display: 'none' }}>
            <img
              src={logo}
              alt=''
              style={{ width: '9%', marginLeft: '300px', marginTop: '0.35rem' }}
            />
          </Box>
          <Box>
            <Button
              onClick={() => {
                setModal2(true);
              }}
            >
              <AssignmentTurnedInIcon
                sx={{
                  fontSize: '2.5rem',
                  marginTop: '-0.4rem',
                  marginRight: '1rem',
                }}
              />
            </Button>
          </Box>
        </Box>

        <Grid container spacing={1} sx={{ padding: '1rem' }}>
          {DaysOfMonthWithTheirNames.map(({ dayNumber, dayOfWeek }) => {
            return (
              <Grid
                sx={{
                  borderLeft: '1px solid #9fb4c7 ',
                  borderTop: '1px solid #9fb4c7 ',
                  borderRight: '0.5px solid #9fb4c7',
                  borderBottom: '0.5px solid #9fb4c7',
                  borderRadius: '4%',
                  minHeight: '125px',

                  ':hover': {
                    backgroundColor: '#e9ecef',
                    cursor: 'pointer',
                  },
                }}
                item
                xs={4}
                sm={4}
                md={1.7142857143}
                lg={1.7142857143}
                onClick={() => {
                  setDay(dayNumber);
                  setMonth(monthName);
                  setYear(getCurrentYear);
                  openModal();
                }}
              >
                <Typography
                  sx={{
                    paddingLeft: '8px',
                    color:
                      dayOfWeek === 'Fri'
                        ? '#EA4335'
                        : dayOfWeek === 'Sat'
                        ? '#EA4335'
                        : 'black',
                  }}
                >{`${dayNumber} ${dayOfWeek}`}</Typography>
                <Box sx={{ marginBottom: '12px' }}>
                  {filteredTasksByDay[dayNumber].map((task) => (
                    <Tooltip title={task.description}>
                      <Typography
                        sx={{
                          width: '90%',
                          backgroundColor: '#4285F4',
                          borderRadius: '5px',
                          marginTop: '5px',
                          paddingLeft: '8px',
                          paddingRight: '8px',
                          color: 'white',
                        }}
                        key={task._id}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          updateCalenderTaskInformation(task._id);
                        }}
                        style={{
                          textDecoration: task.taskCompleted
                            ? 'line-through'
                            : 'none',
                          backgroundColor: task.taskCompleted ? '#c6dafc' : '',
                          color: task.taskCompleted ? '#8794aa' : '',
                        }}
                      >
                        {task.title}
                      </Typography>
                    </Tooltip>
                  ))}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  };

  if (loading) {
    return <div>loading ...</div>;
  } else {
    return <div>{renderCalendar()}</div>;
  }
}

export default App;

//  transform: 'translate(1%,1200%)',
// transform: 'translate(150%,1099%)',
//transform: 'translate(92%,-100%)'
