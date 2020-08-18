import axios from "axios";
import { HexString, Hash, Address, Script } from "@ckb-lumos/base";
import { TransactionSkeletonType } from "@ckb-lumos/helpers";
import { Api, ResponseCode } from "./Api";
import { TxMap } from "../stores/TxTrackerStore";

export interface CkbTransferParams {
  sender: string;
  recipient: string;
  amount: BigInt;
  txFee: BigInt;
}

export type Transaction = GenericTransaction | CkbTransfer;

export interface GenericTransaction {
  params: any;
  description: string;
  txSkeleton: TransactionSkeletonType;
}

export interface CkbTransfer {
  params: CkbTransferParams;
  description: string;
  txSkeleton: TransactionSkeletonType;
}

class DappService {
  dappServerUri: string;
  constructor(dappServerUri) {
    this.dappServerUri = dappServerUri;
  }

  async fetchCkbBalance(lockScript: Script): Promise<BigInt> {
    const response = await Api.post(this.dappServerUri, "/ckb/get-balance", {
      lockScript,
    });
    return BigInt(response.payload.balance);
  }

  async buildTransferCkbTx(
    params: CkbTransferParams
  ): Promise<CkbTransfer> {
    const response = await Api.post(this.dappServerUri, "/ckb/build-transfer", {
      sender: params.sender,
      recipient: params.recipient,
      amount: params.amount.toString(),
      txFee: params.txFee.toString(),
    });

    const data = response.payload;
    data.params = parseCkbTransferParams(data.params);
    data.description = 'Hello Lumos - CKB Transfer Request' // Description to display on Keyperring
    return data;
  }

  async transferCkb(
    params: CkbTransferParams,
    signatures: HexString[]
  ): Promise<Hash> {
    const response = await Api.post(this.dappServerUri, "/ckb/send-transfer", {
      params: stringifyCkbTransferParams(params),
      signatures,
    });

    return response.payload.txHash as Hash;
  }

  async getLatestBlock(): Promise<Number> {
    const response = await Api.get(this.dappServerUri, "/latest-block");
    return Number(response.payload.blockNumber);
  }

  async fetchTransactionStatuses(txHashes: Hash[]) {
    console.log('fetchTransactionStatuses',txHashes );
    const response = await Api.post(
      this.dappServerUri,
      "/fetch-tx-status",
      {
        txHashes,
      }
    );
    return response.payload.txStatuses as TxMap;
  }
}

export const parseCkbTransferParams = (params) => {
  return {
    sender: params.sender,
    amount: BigInt(params.amount),
    recipient: params.recipient,
    txFee: BigInt(params.txFee),
  };
};

export const stringifyCkbTransferParams = (params: CkbTransferParams) => {
  return {
    sender: params.sender,
    amount: params.amount.toString(),
    recipient: params.recipient,
    txFee: params.txFee.toString(),
  };
};

export const dappService = new DappService(
  process.env.REACT_APP_DAPP_SERVER_URI
);
