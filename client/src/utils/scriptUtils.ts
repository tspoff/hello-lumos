import { HexString, Script, Address } from "@ckb-lumos/base";
import * as bech32 from "bech32";
import { getConfig, Config } from "../config/lumosConfig";
import { ckbHash } from "./ckbUtils";
import * as blockchain from "ckb-js-toolkit-contrib/src/blockchain";
import { validators, normalizers } from "ckb-js-toolkit";

export interface Options {
  config?: Config;
}

const BECH32_LIMIT = 1023;

function byteArrayToHex(a: number[]): HexString {
  return "0x" + a.map((i) => ("00" + i.toString(16)).slice(-2)).join("");
}

function hexToByteArray(h: HexString): number[] {
  if (!/^(0x)?([0-9a-fA-F][0-9a-fA-F])*$/.test(h)) {
    throw new Error("Invalid hex string!");
  }
  if (h.startsWith("0x")) {
    h = h.slice(2);
  }
  const array: any[] = [];
  while (h.length >= 2) {
    array.push(parseInt(h.slice(0, 2), 16));
    h = h.slice(2);
  }
  return array;
}

export function generateAddress(
  script: Script,
  { config }: Options = {}
): Address {
  config = config || getConfig();
  const scriptTemplate = Object.values(config.SCRIPTS).find(
    (s) =>
      s!.CODE_HASH === script.code_hash && s!.HASH_TYPE === script.hash_type
  );
  const data: any[] = [];
  if (scriptTemplate && scriptTemplate.SHORT_ID !== undefined) {
    data.push(1, scriptTemplate.SHORT_ID);
    data.push(...hexToByteArray(script.args));
  } else {
    data.push(script.hash_type === "type" ? 4 : 2);
    data.push(...hexToByteArray(script.code_hash));
    data.push(...hexToByteArray(script.args));
  }
  const words = bech32.toWords(data);
  return bech32.encode(config.PREFIX, words, BECH32_LIMIT);
}

export function parseAddress(
  address: Address,
  { config }: Options = {}
): Script {
  config = config || getConfig();
  const { prefix, words } = bech32.decode(address, BECH32_LIMIT);
  if (prefix !== config.PREFIX) {
    throw Error(
      `Invalid prefix! Expected: ${config.PREFIX}, actual: ${prefix}`
    );
  }
  const data = bech32.fromWords(words);
  switch (data[0]) {
    case 1:
      if (data.length < 2) {
        throw Error(`Invalid payload length!`);
      }
      const scriptTemplate = Object.values(config.SCRIPTS).find(
        (s) => s!.SHORT_ID === data[1]
      );
      if (!scriptTemplate) {
        throw Error(`Invalid code hash index: ${data[1]}!`);
      }
      return {
        code_hash: scriptTemplate.CODE_HASH,
        hash_type: scriptTemplate.HASH_TYPE,
        args: byteArrayToHex(data.slice(2)),
      };
    case 2:
      if (data.length < 33) {
        throw Error(`Invalid payload length!`);
      }
      return {
        code_hash: byteArrayToHex(data.slice(1, 33)),
        hash_type: "data",
        args: byteArrayToHex(data.slice(33)),
      };
    case 4:
      if (data.length < 33) {
        throw Error(`Invalid payload length!`);
      }
      return {
        code_hash: byteArrayToHex(data.slice(1, 33)),
        hash_type: "type",
        args: byteArrayToHex(data.slice(33)),
      };
  }
  throw Error(`Invalid payload format type: ${data[0]}`);
}

export function computeScriptHash(script, { validate = true } = {}) {
  if (validate) {
    validators.ValidateScript(script);
  }

  return ckbHash(
    blockchain.SerializeScript(normalizers.NormalizeScript(script))
  ).serializeJson();
}
