'use strict';

const {
  SERIALIZER_TYPE,
} = require('../common/constant');

exports.build = (serializerType = SERIALIZER_TYPE.HESSIAN2.TEXT) => {
  try {
    if (serializerType === SERIALIZER_TYPE.JSON.TEXT) {
      return require('./base');
    }
    const serializer = require(`./${serializerType}`);
    return serializer;
  } catch (err) {
    throw new Error(`不支持 ${serializerType} 序列化协议`);
  }
};