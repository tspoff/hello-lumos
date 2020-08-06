import blake2b from "blake2b";
import { Reader } from "ckb-js-toolkit";

export class CKBHasher {
  hasher: any;

  constructor() {
    this.hasher = blake2b(
      32,
      null,
      null,
      new Uint8Array(Reader.fromRawString("ckb-default-hash").toArrayBuffer())
    );
  }

  update(data) {
    this.hasher.update(new Uint8Array(new Reader(data).toArrayBuffer()));
    return this;
  }

  digestReader() {
    const out = new Uint8Array(32);
    this.hasher.digest(out);
    return new Reader(out.buffer);
  }

  digestHex() {
    return this.digestReader().serializeJson();
  }
}

export function ckbHash(buffer) {
  const hasher = new CKBHasher();
  hasher.update(buffer);
  return hasher.digestReader();
}

export function ckbHashString(buffer) {
  const hash = ckbHash(buffer);
  return new Reader(hash.toArrayBuffer()).serializeJson();
}

export function toBigUInt64LE(num) {
  num = BigInt(num);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(num);
  return `0x${buf.toString("hex")}`;
}

export function readBigUInt64LE(hex) {
  const buf = Buffer.from(hex.slice(2), "hex");
  return buf.readBigUInt64LE();
}

export function toBigUInt128LE(this: any, u128) {
  if (u128 < this.U128_MIN) {
    throw new Error(`u128 ${u128} too small`);
  }
  if (u128 > this.U128_MAX) {
    throw new Error(`u128 ${u128} too large`);
  }
  const buf = Buffer.alloc(16);
  buf.writeBigUInt64LE(u128 & BigInt("0xFFFFFFFFFFFFFFFF"), 0);
  buf.writeBigUInt64LE(u128 >> BigInt(64), 8);
  return "0x" + buf.toString("hex");
}

export function readBigUInt128LE(leHex) {
  if (leHex.length !== 34 || !leHex.startsWith("0x")) {
    throw new Error(`leHex format error`);
  }
  const buf = Buffer.from(leHex.slice(2), "hex");
  return (buf.readBigUInt64LE(8) << BigInt(64)) + buf.readBigUInt64LE(0);
}
