const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server running on port: 8000');
});

const io = socket(server);

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});