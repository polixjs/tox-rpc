'use strict';

const Hessian = require('hessian.js');
const {
  execThrow,
} = require('../../common/util');
const serializerBase = require('../base');

const V = '2.0';

class Hessian2 extends serializerBase {

  constructor() {
    super();
  }

  decode(packet) {
    return execThrow(Hessian.decode, [packet, V],
      'Hessian2 decode error: ');
  }

  encode(packet) {
    return execThrow(Hessian.encode, [packet, V],
      'Hessian2 encode error: ');
  }

}

module.exports = Hessian2;