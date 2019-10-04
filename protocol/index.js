'use strict';

class Protocol {

  constructor(version) {
    this._version = version || 'v1';
  }

  encode() {
    this._encoder = require(`./encode/${this._version}`);
    return this._encoder;
  }

  decode() {
    this._decoder = require(`./decode/${this._version}`);
    return this._decoder;
  }

}


module.exports = Protocol;