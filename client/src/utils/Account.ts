import {
  AddressPrefix,
  AddressType as Type,
  pubkeyToAddress,
} from "@nervosnetwork/ckb-sdk-utils";
import * as ckbUtils from "@nervosnetwork/ckb-sdk-utils";
import { HexString, Address, Script, Hash, HashType } from "@ckb-lumos/base";
import { parseAddress, computeScriptHash } from "./scriptUtils";

export type KeyperRingAccount = {
  address: Address,
  lockScript: {
    codeHash: Hash,
    hashType: HashType,
    args: HexString
  },
  lockHash: Hash,
  publicKey: HexString,
  lockScriptMeta: any
}

export type Account = {
  lockScript: Script;
  lockHash: Hash;
  address: Address;
  pubKey: HexString;
  lockScriptMeta?: any;
};

export const parseAccounts = (addresses: KeyperRingAccount[]): Account[] => {
  return addresses.map((keyperRingAccount) => {
    return {
      address: keyperRingAccount.address,
      lockHash: keyperRingAccount.lockHash,
      lockScript: {
        code_hash: keyperRingAccount.lockScript.codeHash,
        hash_type: keyperRingAccount.lockScript.hashType,
        args: keyperRingAccount.lockScript.args
      },
      pubKey: keyperRingAccount.publicKey
    }
  })
}

export const generateAccountFromPrivateKey = (privKey: HexString): Account => {
  const pubKey = ckbUtils.privateKeyToPublicKey(privKey);
  const address = publicKeyToAddress(pubKey);
  const lockScript = parseAddress(address);
  const lockHash = computeScriptHash(lockScript);

  return {
    lockScript,
    lockHash,
    address,
    pubKey,
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
