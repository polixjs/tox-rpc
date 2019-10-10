'use strict';

const {
  SERIALIZER_TYPE,
} = require('../common/constant');
const Base = require('./base');

exports.build = (serializerType = SERIALIZER_TYPE.HESSIAN2.TEXT) => {
  try {
    if (serializerType === SERIALIZER_TYPE.JSON.TEXT) {
      return new Base();
    }
    const serializer = require(`./${serializerType}`);
    return new serializer();
  } catch (err) {
    throw new Error(`不支持 ${serializerType} 序列化协议`);
  }
};