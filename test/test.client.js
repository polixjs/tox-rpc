'use strict';

const net = require('net');
const Tox = require('../protocol');
const protocol = new Tox();
const encoder = protocol.encode();
const decoder = protocol.decode();
const socket = net.connect(12200, '127.0.0.1');

socket.once('connect', () => {
  console.log('connected');
});
socket.once('close', () => {
  console.log('close');
});
socket.once('error', err => {
  console.log(err);
});

encoder.pipe(socket).pipe(decoder);

// 监听 response / heartbeat_acl
decoder.on('response', res => {
  // console.log(res);
});

// 发送 RPC 请求
encoder.reuqest({
  a: 1
}, {
}, (err, data) => {
  console.log(err, data);
});