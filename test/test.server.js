'use strict';

const net = require('net');
const Tox = require('../protocol');
const protocol = new Tox({
  proto: [],
  kirito: [],
});

const server = net.createServer(socket => {

  const encoder = protocol.encode();
  const decoder = protocol.decode();

  encoder.pipe(socket).pipe(decoder);

  decoder.on('request', (data) => {
    console.log('request', data);
    encoder.response(data, {
      a: 'response',
    });
  });

  socket.once('connect', () => {
    console.log('connected');
  });
  socket.once('close', () => {
    console.log('close');
    socket.destroy();
  });
  socket.once('error', err => {
    console.log(err);
    socket.destroy();
  });
});

server.listen(12200);
console.log('start server');