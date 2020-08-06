import secp256k1 from "secp256k1";
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

export function secpSign(privateKey, message) {
  const { signature, recid } = secp256k1.ecdsaSign(
    new Uint8Array(new Reader(message).toArrayBuffer()),
    new Uint8Array(new Reader(privateKey).toArrayBuffer())
  );
  const array = new Uint8Array(65);
  array.set(signature, 0);
  array.set([recid], 64);
  return new Reader(array.buffer);
}

const byteToHex: any[] = [];

for (let n = 0; n <= 0xff; ++n) {
  const hexOctet = n.toString(16).padStart(2, "0");
  byteToHex.push(hexOctet);
}

export function arrayBufferToHex(arrayBuffer) {
  const buff = new Uint8Array(arrayBuffer);
  const hexOctets: any[] = []; // new Array(buff.length) is even faster (preallocates necessary array size), then use hexOctets[i] instead of .push()

  for (let i = 0; i < buff.length; ++i) hexOctets.push(byteToHex[buff[i]]);

  return "0x" + hexOctets.join("");
}
