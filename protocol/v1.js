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
  buf.putLong(opts.requestId);
  const contentBuf = serializer.encode(opts.content);
  buf.putInt(contentBuf.length);
  buf.put(headerBuf);
  buf.put(contentBuf);
  return buf.array();
};


exports.decode = (serializer, buf) => {
  const byteBuf = ByteBuffer.wrap(buf);
  byteBuf.get();
  const packetType = byteBuf.get();
  byteBuf.get();
  byteBuf.get();
  const isCrc = byteBuf.get();
  const isHpack = byteBuf.get();
  const headerLength = byteBuf.getShort();
  let timeout = null;
  if (PACKET_TYPE.REQUEST.VALUE === packetType) {
    timeout = byteBuf.getInt();
  }
  const requestId = byteBuf.getLong().toString();
  const contentLength = byteBuf.getInt();
  const header = serializer.decode(byteBuf.read(headerLength));
  const content = serializer.decode(byteBuf.read(contentLength));
  return {
    header,
    content,
    requestId,
    timeout,
    isCrc,
    isHpack,
  };
};