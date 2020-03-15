'use strict';

const ByteBuffer = require('byte');
const {
  PROTO,
  PACKET_TYPE,
  VERSION,
  PACKET_PARAM: {
    IS_CRC,
    IS_HPACK,
  },
  HEADERS,
} = require('../common/constant');
const util = require('../common/util');

const K_BUF_MAX_SIZE = 8 * 1024 * 1024;

exports.encode = (opts) => {
  const buf = ByteBuffer.allocate(K_BUF_MAX_SIZE);
  buf.put(PROTO);
  buf.put(PACKET_TYPE[opts.type].VALUE);
  buf.put(VERSION[opts.version].VALUE);
  buf.put(opts.isCrc && IS_CRC.N || IS_CRC.Y);
  buf.put(opts.isHpack && IS_HPACK.N || IS_HPACK.Y);
  const headerBuf = new Buffer(JSON.stringify(opts.headers));
  buf.putShort(headerBuf.length);
  if (opts.type === PACKET_TYPE.REQUEST.TEXT) {
    buf.putInt(opts.timeout);
  }
  buf.putLong(opts.requestId);
  buf.putInt(contentBuf.length);
  buf.put(headerBuf);
  buf.put(contentBuf);
  if (opts.isCrc) {
    const packetFrame = buf._bytes.slice(0, buf.position());
    buf.putInt(util.crc32(packetFrame));
  }
  return buf.array();
};


exports.decode = (buf) => {
  const byteBuf = ByteBuffer.wrap(buf);
  byteBuf.get();
  const packetTypeTag = byteBuf.get();
  byteBuf.get();
  byteBuf.get();
  const isCrc = byteBuf.get() === IS_CRC.N && true || false;
  if (isCrc) {
    const packetLen = byteBuf.limit() - 4;
    const packetFrame = byteBuf._bytes.slice(0, packetLen);
    const crc32Value = byteBuf._bytes.readInt32BE(packetLen);
    if (crc32Value !== util.crc32(packetFrame)) {
      throw new Error('CRC 校验失败!');
    }
  }
  let timeout = null;
  let packetType = PACKET_TYPE.RESPONSE.TEXT;
  if (PACKET_TYPE.REQUEST.VALUE === packetTypeTag) {
    timeout = byteBuf.getInt();
    packetType = PACKET_TYPE.REQUEST.TEXT;
  }
  const requestId = byteBuf.getLong().toString();
  const contentLength = byteBuf.getInt();
  const content = byteBuf.read(contentLength);
  return {
    content,
    requestId,
    timeout,
    isCrc,
    packetType,
  };
};