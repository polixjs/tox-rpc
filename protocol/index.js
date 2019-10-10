'use strict';

const {
  CHECK_VERSION,
  CHECK_SERIALIZER,
} = require('../common/util');

const {
  SERIALIZER_TYPE,
  VERSION,
} = require('../common/constant');
const Encoder = require('./encode');
const Decoder = require('./decode');

class Protocol {

  constructor(opts = {}) {
    const version = opts.version;
    const codecType = opts.codecType;
    CHECK_VERSION(version);
    CHECK_SERIALIZER(codecType);
    this._opts = opts;
    this._opts.version = version && version.toLocaleUpperCase() || VERSION.V1.TEXT;
    this._opts.codecType = codecType && codecType.toLocaleUpperCase() || SERIALIZER_TYPE.HESSIAN2.TEXT;
  }

  encode() {
    this._encoder = new Encoder(this._opts);
    return this._encoder;
  }

  decode() {
    this._decoder = new Decoder(this._opts);
    return this._decoder;
  }

}


module.exports = Protocol;