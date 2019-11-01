'use strict';

const protobuf = require('protobufjs');
const protoLoad = require('util').promisify(protobuf.load);
const N = require('../common/constant').SERIALIZER_TYPE.PROTOBUF;
const {
  execThrow,
  CHECK_EMPTY,
} = require('../common/util');
const serializerBase = require('./base');

class Protobuf extends serializerBase {

  constructor() {
    super(N.TEXT);
  }

  async loadClass(classPath) {
    await protoLoad(classPath);
  }

  encode(packet, className) {
    const msgClass = this.protoMessage.get(className);
    CHECK_EMPTY(msgClass);
    return execThrow(msgClass.encode, [packet],
      'Protobuf encode error: ').finish();
  }

  decode(packet, className) {
    const msgClass = this.protoMessage.get(className);
    CHECK_EMPTY(msgClass);
    return execThrow(msgClass.decode, [packet],
      'Protobuf decode error: ');
  }

}

module.exports = Protobuf;