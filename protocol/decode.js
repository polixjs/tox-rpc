'use srict';

const Writable = require('stream').Writable;
const {
  PACKET_PARAM,
  PACKET_TYPE,
} = require('../common/constant');
const transverter = require('./transverter');

const getPacketLength = (buf) => {
  let packetLen = 0;
  if (buf[1] === PACKET_TYPE.REQUEST.VALUE) {
    packetLen = 24 + buf.readInt16BE(6) + buf.readInt32BE(20);
  } else {
    packetLen = 20 + buf.readInt16BE(6) + buf.readInt32BE(16);
  }

  if (buf[4] === PACKET_PARAM.IS_CRC.N) {
    packetLen += 4;
  }

  return packetLen;
};

class Decoder extends Writable {

  constructor(opts) {
    super();
  }

  _write(chunk, encoding, callback) {
    // 合并 buf 中的数据
    this._buf = this._buf ? Buffer.concat([ this._buf, chunk ]) : chunk;
    try {
      let unfinish = false;
      do {
        unfinish = this._decode();
      } while (unfinish);
      callback();
    } catch (err) {
      err.name = 'ToxDecodeError';
      err.data = this._buf ? this._buf.toString('base64') : '';
      callback(err);
    }
  }

  _decode() {
    const bufLen = this._buf.length;
    const packetLen = getPacketLength(this._buf);
    if (bufLen < packetLen) {
      return true;
    }
    const data = transverter.decode(this._buf);
    this.emit(data.packetType.toLowerCase(), data);
    return false;
  }

}

module.exports = Decoder;