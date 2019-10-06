'use strict';

const {
  execThrow,
} = require('../common/util');

class serializerBase {

  constructor() {
  }

  decode(packet) {
    return execThrow(JSON.parse, [packet], 'JSON parse error: ');
  }

  encode(packet) {
    return execThrow(JSON.stringify, [packet], 'JSON stringify error: ');
  }

}


module.exports = serializerBase;