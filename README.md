# tox.js

Tox RPC 网络协议，适用于移动设备高频次、数据包小的场景

- 支持 CRC32 校验, 默认关闭

## 报文字段

- proto 标识是否是 TOX 协议
- type 标识数据包是请求还是响应
- version TOX 协议版本
- isCrc 是否开启 crc32 校验
- timeout 请求超时时间
- requestId 请求数据包ID
- contentLength 数据包 body 长度
- crc32 当 isCrc 为 0x01 时有该值，为消息体的 crc32 值

## Author
tox.jx © [Ricky 泽阳](https://github.com/rickyes), Released under the MIT License. 