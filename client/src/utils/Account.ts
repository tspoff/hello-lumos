import {
  AddressPrefix,
  AddressType as Type,
  pubkeyToAddress,
} from "@nervosnetwork/ckb-sdk-utils";
import * as ckbUtils from "@nervosnetwork/ckb-sdk-utils";
import { HexString, Address, Script, Hash } from "@ckb-lumos/base";
import { getConfig } from "../config/lumosConfig";
import { parseAddress, computeScriptHash } from "./scriptUtils";
import { hexStringToArrayBuffer } from "./conversion";
import { ckbHashString } from "./ckbUtils";

export type Account = {
  lockScript: Script;
  lockHash: Hash;
  address: Address;
  pubKey: HexString;
  pubKeyHash: Hash;
  privKey: HexString;
};

export const generateAccountFromPrivateKey = (privKey: HexString): Account => {
  const pubKey = ckbUtils.privateKeyToPublicKey(privKey);
  const pubKeyHash = ckbHashString(hexStringToArrayBuffer(pubKey));
  const address = publicKeyToAddress(pubKey);
  const lockScript = parseAddress(address);
  const lockHash = computeScriptHash(lockScript);

  return {
    lockScript,
    lockHash,
    address,
    pubKey,
    pubKeyHash,
    privKey,
  };
};

/* 
Code from Address class from Synapse Extension
Credit: https://github.com/rebase-network/synapse-extension
*/

export const publicKeyToAddress = (
  publicKey: string,
  prefix = AddressPrefix.Testnet
) => {
  const pubkey = publicKey.startsWith("0x") ? publicKey : `0x${publicKey}`;
  return pubkeyToAddress(pubkey, {
    prefix,
    type: Type.HashIdx,
    codeHashOrCodeHashIndex: "0x00",
  });
};
