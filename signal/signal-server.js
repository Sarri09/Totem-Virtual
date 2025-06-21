const http    = require('http'),
      express = require('express'),
      { Server } = require('socket.io');

const app = express(),
      srv = http.createServer(app),
      io  = new Server(srv, { cors: { origin: '*' } });

const rooms = {};
const PORT = process.env.SIGNAL_PORT || 3000;

io.on('connection', socket => {
  socket.on('join-room', roomId => {
    socket.join(roomId);
    rooms[socket.id] = roomId;
    socket.to(roomId).emit('peer-joined', socket.id);
  });
  socket.on('signal', ({ to, data }) => {
    io.to(to).emit('signal', { from: socket.id, data });
  });
  socket.on('disconnect', () => {
    const roomId = rooms[socket.id];
    socket.to(roomId).emit('peer-left', socket.id);
    delete rooms[socket.id];
  });
});

app.get('/', (_, res) => res.send('Signal server OK'));
srv.listen(PORT, () => console.log('Signal listening on ${PORT}'));
