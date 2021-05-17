const express = require('express');
const socket = require('socket.io');

const db = require('./db');
const tasks = db.tasks;

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New user connect on id:', socket.id);
  io.to(socket.id).emit('updateData', tasks);

  socket.on('addTask', (addTask) => {
    tasks.push(addTask);

    socket.broadcast.emit('addTask', addTask);
    //console.log('New task: ' , addTask , ' from client ' + socket.id);
  });

  socket.on('removeTask', (id) => {
    const searchTask = tasks.find( task => task.id === id);
    const index = tasks.indexOf(searchTask);

    tasks.splice(index, 1);
    socket.broadcast.emit('removeTask', id);

    //console.log('Client with id - ' + socket.id + ' remove task ' + id);
  });
  
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});