'use strict';

const toTextValue = (obj) => {
  const key = Object.keys(obj)[0];
  return Object.create(null, {
    TEXT: {
      value: key,
    },
    VALUE: {
      value: obj[key],
    },
  });
};

module.exports = {
  PROTO: 0x08,
  VERSION: {
    V1: toTextValue({
      V1: 0x01,
    }),
  },
  PACKET_PARAM: {
    // 是否开启 crc 校验
    IS_CRC: {
      Y: 0x00,
      N: 0x01,
    },
    // 是否开启 hpack 压缩
    IS_HPACK: {
      Y: 0x00,
      N: 0x01,
    },
  },
  // 报文类型，请求或响应
  PACKET_TYPE: {
    REQUEST: toTextValue({
      REQUEST: 0x01,
    }),
    RESPONSE: toTextValue({
      RESPONSE: 0x02,
    }),
  },
  // ID 生成方式
  GENERATOR_ID_TYPE: {
    SNOWFLAKE: 'snowflake',
    UUID: 'uuid',
  },
  REQUEST_PARAM: {
    TIMEOUT: 10 * 3600,
  },
  // 序列化类型
  SERIALIZER_TYPE: {
    HESSIAN: toTextValue({
      HESSIAN: 0x01,
    }),
    HESSIAN2: toTextValue({
      HESSIAN2: 0x02,
    }),
    KIRITOBUF: toTextValue({
      KIRITOBUF: 0x03,
    }),
    PROTOBUF: toTextValue({
      PROTOBUF: 0x04,
    }),
    T_BINARY_PROTOCOL: toTextValue({
      T_BINARY_PROTOCOL: 0x05,
    }),
    JSON: toTextValue({
      JSON: 0x06,
    }),
  },
  // tox 协议保留 headers
  HEADERS: {
    // 使用有序列化描述文件的协议时需带上的header，eg: protobuf/tbinaryprotocol/kritobuf
    TOX_CODEC_CLASS: 'Tox-Codec-Class',
  },
  // 序列化元数据类型
  META_TYPE: {
    PROTOBUF: 'PROTOBUF',
  },
};