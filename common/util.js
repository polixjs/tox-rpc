'use strict';

const uuid = require('uuid/v4');
const {
  simpleflake,
} = require('simpleflakes');
const {
  VERSION,
  SERIALIZER_TYPE,
  PROTO,
  GENERATOR_ID_TYPE,
} = require('../common/constant');
const flakeBigInt = simpleflake();

/**
 * 生成不带`-`的 UUID
 */
exports.uuid = () => uuid().replace(/\-/g, '');

/**
* try 执行函数
* @param {Function} fn 执行函数
* @param {Array<any>} args 函数参数数组
* @param {String} ?errMsg 错误信息
* @param {any} 函数执行返回值
*/
exports.execThrow = (fn, args, errMsg) => {
  try {
    return fn(...args);
  } catch (err) {
    throw new Error(`${errMsg} ${err.message}`);
  };
};


/**
 * 执行同步任务
 * @param {Function} fn 执行函数
 * @param {Array<any>} args 函数入参
 * @returns {Array<Object: error, any: data>} 返回值
 */
exports.execSyncBySuccess = (fn, args) => {
  try {
    const result = fn.apply(this, args);
    return [null, result];
  } catch (error) {
    return [error, null];
  }
};


/**
 * 检查 Tox 协议版本号有效性
 * @param {String} v Tox 版本号
 */
exports.CHECK_VERSION = v => {
  if (v && VERSION[v] === null) {
    throw new Error(`Tox 协议没有此版本： ${v}`);
  }
};


/**
 * 检查 Tox 序列化协议有效性
 * @param {String} serializer 序列化协议名称
 */
exports.CHECK_SERIALIZER = serializer => {
  if (serializer && SERIALIZER_TYPE[serializer] === null) {
    throw new Error(`Tox 不支持此序列化协议： ${serializer}`);
  }
};


/**
 * 根据序列化值查找序列化类型
 * @param {Number} value 序列化值
 */
exports.findSerializerType = (value, compare = (a, b) => a === b) => {
  return Object.keys(SERIALIZER_TYPE).find(k => compare(SERIALIZER_TYPE[k].VALUE, value));
};


/**
 * 检查报文有效性
 * @param {Number} proto TOX 协议标识
 */
exports.CHECK_PROTO = proto => {
  if (proto && proto !== PROTO) {
    throw new Error(`非法报文： ${proto}`);
  }
};


/**
 * ID生成器
 * @param {String} type 生成器类型, 默认雪花算法
 * -- SNOWFLAKE : 64-bit
 * -- UUID : uuid/v4
 */
exports.generatorId = (type = GENERATOR_ID_TYPE.SNOWFLAKE) => {
  switch (type) {
    case GENERATOR_ID_TYPE.SNOWFLAKE:
      return flakeBigInt.toString();
    case GENERATOR_ID_TYPE.UUID:
      return this.uuid();
  }
};