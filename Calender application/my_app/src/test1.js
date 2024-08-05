import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
          reminder,
          reminderHour,
          reminderMinute,
        }),
      });

      if (response.ok) {
        console.log('Createing calender task is successful');
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

        console.log('Getting calender task is successful');
        console.log(data);
      } else {
        console.log('failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCalenderTaskInformation = async (id) => {
    try {
      const updatTaskURL = `http://localhost:5000/Calender/api/v1/${id}`;
      const response = await fetch(updatTaskURL, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({ taskCompleted }),
      });

      if (response.ok) {
        console.log('updating calender task is successful');
        window.location.reload();
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

  /*const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }; */

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

    /*for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(
        <Grid item key={day}>
          <Typography>
            {day} {dayName}
          </Typography>
        </Grid>
      );
    }*/

    // Request parts

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

    console.log(filteredTasksByDay);

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
                      padding: '4px',
                    },
                    textAlign: 'right',
                  }}
                />
              </IconButton>
            </Box>
            <Box sx={{ width: '100%', transform: 'translate(0%,35%)' }}>
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
                    checked={reminder}
                    onChange={(e) => {
                      setReminder(e.target.checked);
                    }}
                    color='primary' // or "secondary"
                    // You can customize the appearance using other props such as size, icon, etc.
                  />
                }
                label='My Checkbox'
              />
            </Box>
            <Box
              sx={{
                display: reminder ? 'flex' : 'none',
                marginTop: '3rem',
                justifyContent: 'center',
              }}
            >
              {' '}
              <TextField
                type='text'
                variant='standard'
                onChange={(e) => {
                  setReminderHour(e.target.value);
                }}
                multiline
                placeholder='HH'
                sx={{ width: '7.5%', marginTop: '2rem', marginRight: '4px' }}
              />
              <TextField
                type='text'
                variant='standard'
                onChange={(e) => {
                  setReminderMinute(e.target.value);
                }}
                multiline
                placeholder='MM'
                sx={{ width: '7.5%', marginTop: '2rem' }}
              />
            </Box>
            <Box
              sx={{
                marginTop: '4rem',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                sx={{ marginTop: '0.65rem' }}
              >{`${day} ${month} ${year}`}</Typography>
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

        <Typography variant='h5' gutterBottom>
          {monthName} {getCurrentYear}
        </Typography>

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
                  minHeight: '150px',

                  ':hover': {
                    backgroundColor: '#e9ecef', // Change this color to whatever you want on hover
                    cursor: 'pointer', // Changes the cursor to a pointer to indicate it's clickable
                  },
                }}
                item
                xs={4}
                sm={4}
                md={1.5}
                lg={1.5}
                onClick={() => {
                  setDay(dayNumber);
                  setMonth(monthName);
                  setYear(getCurrentYear);
                  openModal();
                }}
              >
                {' '}
                <Typography
                  sx={{ paddingLeft: '8px' }}
                >{`${dayNumber} ${dayOfWeek}`}</Typography>
                <Box sx={{ marginBottom: '12px' }}>
                  {' '}
                  {filteredTasksByDay[dayNumber].map((task) => (
                    <Tooltip title={task.description}>
                      <Typography
                        sx={{
                          width: '90%',
                          backgroundColor: '#4285F4',
                          marginTop: '5px',
                          paddingLeft: '8px',
                          paddingRight: '8px',
                          color: 'white',
                        }}
                        key={task._id}
                        onContextMenu={() =>
                          updateCalenderTaskInformation(task._id)
                        }
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

  return (
    <div>
      <Button onClick={goToPreviousMonth}>Previous Month</Button>
      <Button onClick={goToNextMonth}>Next Month</Button>
      {renderCalendar()}
    </div>
  );
}

export default App;
