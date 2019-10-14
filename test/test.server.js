'use strict';

const net = require('net');
const Tox = require('../protocol');
const protocol = new Tox();

const encoder = protocol.encode();
const decoder = protocol.decode();

const server = net.createServer(socket => {

  encoder.pipe(socket).pipe(decoder);

  decoder.on('request', (buf) => {
    console.log(buf);
    encoder.reuqest({
      a: '1',
    }, null, (err, data) => {
      console.log(err, data);
    });
  });

  socket.once('connect', () => {
    console.log('connected');
  });
  socket.once('close', () => {
    console.log('close');
  });
  socket.once('error', err => {
    console.log(err);
  });
});

server.listen(12200);
console.log('start server');