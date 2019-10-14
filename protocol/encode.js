'use srict';

const Transform = require('stream').Transform;
const util = require('../common/util');
const C = require('../common/constant');
const transverter = require('./transverter');

const H = {
  'tox-rpc': 1
};

class Encoder extends Transform {

  constructor(opts) {
    super();
    this._opts = opts;
    this._meta = {
      startTime: null,
      codecType: opts.codecType,
      isCrc: opts.isCrc || false,
      isHpack: opts.isHpack || true,
      version: opts.version,
      packetType: C.PACKET_TYPE.REQUEST.TEXT,
      timeout: opts.timeout || C.REQUEST_PARAM.TIMEOUT,
      requestId: null,
      headerLength: 0,
      bodyLength: 0,
    };
    this.on('close', () => {
    });
  }

  reuqest(body, param = {}, callback) {
    this._push({
      headers: Object.assign(H, param.headers || {}),
      content: body || {},
      meta: Object.assign(this._meta, {
        timeout: param.timeout || C.REQUEST_PARAM.TIMEOUT,
        packetType: C.PACKET_TYPE.REQUEST.TEXT,
        startTime: Date.now(),
      }),
    }, callback);
  }


  response(packet, callback) {
    this._push({
      requestId: packet.requestId,
      content: packet || {},
      meta: Object.assign(this._meta, {
        packetType: C.PACKET_TYPE.RESPONSE.TEXT,
      }),
    }, callback);
  }

  _requestEncode(packet) {
    packet.meta.requestId = util.uuid();
    return transverter.encode(packet);
  }

  _responseEncode(packet) {
    const timeout = packet.meta.timeout;
    if (timeout) {
      const callTime = Date.now() - packet.meta.startTime;
      if (callTime > timeout) {
        throw new Error(`请求超时，响应超过 ${timeout} (ms)`);
      }
    }
    return transverter.encode(packet);
  }


  _push(packet, callback) {
    let buf;
    try {
      let fn = this._requestEncode;
      packet.packetType === C.PACKET_TYPE.RESPONSE.TEXT && (fn = this._responseEncode);
      buf = fn.call(this, packet);
    } catch (err) {
      callback(err, packet);
      throw new Error(err);
    }
    this.write(buf, err => {
      callback(err, packet);
    });
  }


  _transform(buf, encoding, callback) {
    callback(null, buf);
  }

}

module.exports = Encoder;