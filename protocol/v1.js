'use strict';

const ByteBuffer = require('byte');
const {
  PROTO,
  PACKET_TYPE,
  SERIALIZER_TYPE,
  VERSION,
  PACKET_PARAM: {
    IS_CRC,
    IS_HPACK,
  },
} = require('../common/constant');

const kMaxBuf = 8 * 1024 * 1024;

exports.encode = (serializer, opts) => {
  const buf = ByteBuffer.allocate(kMaxBuf);
  buf.put(PROTO);
  buf.put(PACKET_TYPE[opts.type].VALUE);
  buf.put(SERIALIZER_TYPE[opts.codec].VALUE);
  buf.put(VERSION[opts.version].VALUE);
  buf.put(opts.isCrc && IS_CRC.N || IS_CRC.Y);
  buf.put(opts.isCrc && IS_HPACK.N || IS_HPACK.Y);
  const headerBuf = serializer.encode(opts.headers);
  buf.putShort(headerBuf.length);
  if (opts.type === PACKET_TYPE.REQUEST.TEXT) {
    buf.putInt(opts.timeout);
  }
  buf.putInt(opts.requestId);
  const contentBuf = serializer.encode(opts.content);
  buf.putInt(contentBuf.length);
  buf.put(headerBuf);
  buf.put(contentBuf);
  return buf.array();
};


exports.decode = (serializer, opts, buf) => {
  const proto = buf.get();
  const packetType = buf.get();
  const serializerType = buf.get();
  const version = buf.get();
  const isCrc = buf.get();
  const isHpack = buf.get();
  const headerLength = buf.getShort();
  let timeout = null;
  if (PACKET_TYPE.REQUEST.VALUE === packetType) {
    timeout = buf.getInt();
  }
  const requestId = buf.getInt();
  const contentLength = buf.getInt();
  let headerBuf = buf.read(headerLength);
  let content = buf.read(contentLength);
};