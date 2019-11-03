'use strict';

const protobuf = require('protobufjs');
const N = require('../common/constant').SERIALIZER_TYPE.PROTOBUF;
const {
  execThrow,
  CHECK_EMPTY,
} = require('../common/util');
const serializerBase = require('./base');

class Protobuf extends serializerBase {

  constructor() {
    super(N.TEXT);
    this.classPkgMap = new Map();
  }

  loadClass(classPath) {
    const root = protobuf.loadSync(classPath);
    const packages = root.nested;
    for (const pkg in packages) {
      if (packages.hasOwnProperty(pkg)) {
        this.classPkgMap.set(pkg, root);
      }
    }
  }

  getClass(classPackage) {
    const packageName = classPackage.split('.')[0];
    const root = this.classPkgMap.get(packageName);
    if (!root) {
      throw new Error(`序列化描述文件不存在package: ${packageName}`);
    }
    return root.lookupType(classPackage);
  }

  encode(packet, className) {
    const msgClass = this.protoMessage.get(className);
    CHECK_EMPTY(msgClass);
    return execThrow(msgClass.encode, [packet],
      'Protobuf encode error: ').finish();
  }

  decode(packet, className) {
    const msgClass = this.protoMessage.get(className);
    CHECK_EMPTY(msgClass);
    return execThrow(msgClass.decode, [packet],
      'Protobuf decode error: ');
  }

}

module.exports = Protobuf;