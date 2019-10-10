'use strict';

const Serializer = require('../serializer');

class Transverter {

  constructor(opts) {
    this._protocol = require(`./${opts.version}`);
    this._serializer = Serializer.build(opts.codecType);
  }

  encode(packet) {
    const meta = packet.meta;
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
    return this._protocol.encode(this._serializer, opts);
  }
}

module.exports = Transverter;