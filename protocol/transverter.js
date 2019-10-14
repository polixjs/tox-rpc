'use strict';

const Serializer = require('../serializer');

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
  const version = buf[1];
  const codecType = buf[2];
  if (!ProtocolMap[version]) {
    ProtocolMap[version] = require(`./${version}`);
  }
  if (!SerializerMap[codecType]) {
    SerializerMap[codecType] = Serializer.build(codecType);
  }
  const serializer = SerializerMap[codecType];
  const protocol = ProtocolMap[version];
  return protocol.decode(serializer, buf);
};