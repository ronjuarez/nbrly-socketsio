const express = require('express');
const cors = require('cors')
const socketio = require('socket.io');
const http = require('http');
const ikea = require('ikea-name-generator');


const PORT = 8080;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const users = [];

io.on('connection', (socket) => {
  console.log('user has connected!')
  let temp = {username: ikea.getName(false)};
  users.push(temp);
  socket.emit('intial', {user: temp, users});
  socket.user = temp;
  io.emit('users', {users})

  socket.on('message', (data) => {
    console.log(data);
    io.emit('message', data);
  })

  socket.on('disconnect', () => {
    console.log(socket.user);
    let pos = users.map(user => user.username).indexOf(socket.user.username);
    users.splice(pos, 1);
    io.emit('users', {users})
    console.log('user disconnected');
  })
})


server.listen(PORT, () => console.log(`Server has started on ${PORT}`));