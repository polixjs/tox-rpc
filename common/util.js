'use strict';

const uuid = require('uuid/v4');
const {
  VERSION,
  SERIALIZER_TYPE,
} = require('../common/constant');

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