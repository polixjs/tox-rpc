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
    IS_CRC: {
      Y: 0x00,
      N: 0x01,
    },
    IS_HPACK: {
      Y: 0x00,
      N: 0x01,
    },
  },
  PACKET_TYPE: {
    REQUEST: toTextValue({
      REQUEST: 0x01,
    }),
    RESPONSE: toTextValue({
      RESPONSE: 0x02,
    }),
  },
  REQUEST_PARAM: {
    TIMEOUT: 10 * 3600,
  },
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
};