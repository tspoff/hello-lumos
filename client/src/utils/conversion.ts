import { HexString } from "@ckb-lumos/base";

// source: http://stackoverflow.com/a/11058858
export function hexStringToArrayBuffer(hexString: HexString) {
  const str = hexString.slice(2); //Remove leading '0x'
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// source: http://stackoverflow.com/a/11058858
export function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
