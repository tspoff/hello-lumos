import axios from "axios";
import { HexString, Hash, Address, Script } from "@ckb-lumos/base";
import { TransactionSkeletonType } from "@ckb-lumos/helpers";

export interface CkbTransferParams {
  sender: string;
  recipient: string;
  amount: BigInt;
  txFee: BigInt;
}

export type Transaction = GenericTransaction | CkbTransfer;

export interface GenericTransaction {
  params: any;
  txSkeleton: TransactionSkeletonType;
}

export interface CkbTransfer {
  params: CkbTransferParams;
  txSkeleton: TransactionSkeletonType;
}

class DappService {
  dappServerUri: string;
  constructor(dappServerUri) {
    this.dappServerUri = dappServerUri;
  }

  async fetchCkbBalance(lockScript: Script) {
    const response = await axios.post(`${this.dappServerUri}/ckb/get-balance`, {
      lockScript,
    });
    const data = JSON.parse(response.data);
    return BigInt(data.balance);
  }

  async buildTransferCkbTx(
    sender: Address,
    amount: BigInt,

    recipient: Address,
    txFee: BigInt
  ) {
    const response = await axios.post(
      `${this.dappServerUri}/ckb/build-transfer`,
      {
        sender,
        amount: amount.toString(),
        recipient,
        txFee: txFee.toString(),
      }
    );
    let data: CkbTransfer = JSON.parse(response.data);
    data.params = parseCkbTransferParams(data.params);
    return data;
  }

  async transferCkb(
    params: CkbTransferParams,
    signatures: HexString[]
  ): Promise<{error?: string, data?: Hash}> {
    try {
      const response = await axios.post(`${this.dappServerUri}/ckb/transfer`, {
        params: stringifyCkbTransferParams(params),
        signatures,
      });
      const data = JSON.parse(response.data);
      return {
        data: data.txHash as Hash
      }
    } catch (error) {
      return {
        error: JSON.parse(error.request.response).error
      }
    }
  }

  async getLatestBlock() {
    const response = await axios.get(`${this.dappServerUri}/ckb/latest-block`);
    const data = JSON.parse(response.data);

    return {
      data: Number(data.blockNumber)
    }
  }

  async fetchTransactionStatuses(txHashes: Hash[]) {
    const response = await axios.post(`${this.dappServerUri}/ckb/fetch-tx-status`, {
      txHashes
    });
    const data = JSON.parse(response.data);
    return {
      data: data.txStatuses
    }
  }
}

export const parseCkbTransferParams = (params) => {
  return {
    sender: params.sender,
    amount: BigInt(params.amount),
    recipient: params.recipient,
    txFee: BigInt(params.txFee)
  }
}

export const stringifyCkbTransferParams = (params: CkbTransferParams) => {
  return {
    sender: params.sender,
    amount: params.amount.toString(),
    recipient: params.recipient,
    txFee: params.txFee.toString()
  }
}

export const dappService = new DappService(
  process.env.REACT_APP_DAPP_SERVER_URI
);
