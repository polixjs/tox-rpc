'use strict';

const Serializer = require('../serializer');
const {
  CHECK_VERSION,
  CHECK_PROTO,
  findSerializerType,
} = require('../common/util');
const {} = require('../common/constant');

const SerializerMap = {};
const ProtocolMap = {};

exports.encode = (packet) => {
  const meta = packet.meta;
  if (!ProtocolMap[meta.version]) {
    ProtocolMap[meta.version] = require(`./${meta.version}`);
  }
  const protocol = ProtocolMap[meta.version];
  if (!SerializerMap[meta.codecType]) {
    SerializerMap[meta.codecType] = Serializer.build(meta.codecType);
  }
  const serializer = SerializerMap[meta.codecType];
  const opts = {
    type: meta.packetType,
    codec: meta.codecType,
    version: meta.version,
    isCrc: meta.isCrc,
    isHpack: meta.isHpack,
    timeout: Number(meta.timeout),
    requestId: meta.requestId,
    headers: packet.headers,
    content: packet.content,
  };
  return protocol.encode(serializer, opts);
};

exports.decode = (buf) => {
  const proto = buf[0];
  CHECK_PROTO(proto);
  const codecType = buf[2];
  const version = buf[3];
  const v = `V${version}`;
  CHECK_VERSION(v);
  if (!ProtocolMap[version]) {
    ProtocolMap[version] = require(`./${v}`);
  }
  const serializerType = findSerializerType(codecType);
  if (!SerializerMap[serializerType]) {
    SerializerMap[serializerType] = Serializer.build(serializerType);
  }
  const serializer = SerializerMap[serializerType];
  const protocol = ProtocolMap[version];
  return protocol.decode(serializer, buf);
};