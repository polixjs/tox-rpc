'use strict';

const {
  CHECK_VERSION,
  CHECK_PROTO,
} = require('../common/util');
const {
  VERSION,
} = require('../common/constant');
const protocolV1 = require('./V1');

exports.encode = (packet) => {
  const meta = packet.meta;
  const opts = {
    type: meta.packetType,
    version: meta.version,
    isCrc: meta.isCrc,
    timeout: Number(meta.timeout),
    requestId: meta.requestId,
    content: packet.content,
  };
  if (meta.version === VERSION.V1.TEXT) {
    return protocolV1.encode(opts);
  }
};

exports.decode = (buf) => {
  const proto = buf[0];
  CHECK_PROTO(proto);
  const version = buf[3];
  const v = `V${version}`;
  CHECK_VERSION(v);
  if (version === VERSION.V1.VALUE) {
    return protocolV1.decode(buf);
  }
};