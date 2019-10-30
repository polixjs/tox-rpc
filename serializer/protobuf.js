'use strict';

const protobuf = require('protobufjs');
const N = require('../common/constant').SERIALIZER_TYPE.PROTOBUF;
const {
  execThrow,
} = require('../common/util');
const serializerBase = require('./base');

class Protobuf extends serializerBase {

  constructor() {
    super(N.TEXT);
    this.protoMessage = new Map();
  }

  decode(packet) {
    // return execThrow(, [packet],
    //   'Protobuf decode error: ');
  }

  encode(packet) {
    // return execThrow(Hessian.encode, [packet, V],
    //   'Protobuf encode error: ');
  }

}

module.exports = Hessian2;