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
    const version = opts.version && opts.version.toLocaleUpperCase() || VERSION.V1.TEXT;
    const codecType = opts.codecType && opts.codecType.toLocaleUpperCase() || SERIALIZER_TYPE.HESSIAN2.TEXT;
    CHECK_VERSION(version);
    CHECK_SERIALIZER(codecType);
    this._opts = opts;
    this._opts.codecMetaPaths = [];
    this._opts.version = version;
    this._opts.codecType = codecType;
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