'use strict';

const {
  execThrow,
} = require('../common/util');
const N = require('../common/constant').SERIALIZER_TYPE.JSON;

class serializerBase {

  constructor(name) {
    this.name = name || N.TEXT;
  }

  decode(packet) {
    return execThrow(JSON.parse, [packet], 'JSON parse error: ');
  }

  encode(packet) {
    return execThrow(JSON.stringify, [packet], 'JSON stringify error: ');
  }

}


module.exports = serializerBase;