import { Transaction } from "./DappService";
import { parseAccounts } from "../utils/Account";
import { fromTxSkeleton } from "../utils/keyperringUtils";
import { HexString } from "@ckb-lumos/base";

class WalletService {
  walletUri: string;
  token: string | undefined;

  constructor(walletUrl) {
    this.walletUri = walletUrl;
    this.token = undefined;
  }

  async requestAuth(description): Promise<string | undefined> {
    try {
      let res = await fetch(this.walletUri, {
        method: "POST",
        body: JSON.stringify({
          id: 2,
          jsonrpc: "2.0",
          method: "auth",
          params: {
            description,
          },
        }),
      });
      res = await res.json();
      // @ts-ignore
      return res.result.token as string;
    } catch (error) {
      console.error("error", error);
    }
  }

  setToken(token: string) {
    this.token = token;
  }

  async getAccounts(): Promise<Account[]> {
    if (!this.token) {
      throw new Error("Wallet permission token not obtained");
    }
    try {
      let res = await fetch(this.walletUri, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          id: 3,
          jsonrpc: "2.0",
          method: "query_addresses",
        }),
      });
      res = await res.json();
      console.log(res);
      // @ts-ignore
      return parseAccounts(res.result.addresses);
    } catch (error) {
      throw new Error(error);
    }
  }

  async signTransaction(tx: Transaction, lockHash): Promise<HexString[]> {
      const rawTx = fromTxSkeleton(tx.txSkeleton);
      console.log(tx.txSkeleton);

      rawTx.witnesses[0] = {
        lock: "",
        inputType: "",
        outputType: "",
      };

      console.log(rawTx);
      let res = await fetch(this.walletUri, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          id: 4,
          jsonrpc: "2.0",
          method: "sign_transaction",
          params: {
            tx: rawTx,
            lockHash,
            description: tx.description,
          },
        }),
      });
      res = await res.json();
      // @ts-ignore
      return res.result.tx.witnesses as HexString[]; // Return string array of witnesses
  }

  // signTx(tx: Transaction) {
  //   const signatures: HexString[] = [];
  //   tx.txSkeleton.signingEntries.forEach((entry) => {
  //     signatures.push(this.sign(entry.message));
  //   });
  //   return signatures;
  // }
}

export const walletService = new WalletService(
  process.env.REACT_APP_KEYPERRING_URI
);
