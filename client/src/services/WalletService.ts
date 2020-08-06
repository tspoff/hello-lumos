import { generateAccountFromPrivateKey, Account } from "../utils/Account";
import { TransactionSkeletonType } from "@ckb-lumos/helpers";
import { Address, HexString } from "@ckb-lumos/base";
import { AccountMap } from "../stores/WalletStore";
import { arrayBufferToHex, secpSign } from "../utils/ckbUtils";
import { Transaction } from "./DappService";

class WalletService {
  walletUri: string;
  accounts: AccountMap;
  activeAccount: Account | null;

  constructor(walletUrl, isLocal = true) {
    this.walletUri = walletUrl;
    this.accounts = {} as AccountMap;
    this.activeAccount = null;
    if (isLocal) {
      const account = WalletService.generateAccountFromConfig();
      this.addAccount(account);
      this.setActiveAccount(account.address);
    }
  }

  getActiveAccount(): Account | null {
    return this.activeAccount;
  }

  getAccounts(): AccountMap {
    return this.accounts;
  }

  private addAccount(account: Account) {
    this.accounts[account.address] = account;
  }

  private setActiveAccount(address: Address) {
    if (!this.accounts[address]) {
      throw new Error(
        `Attempting to set active account to address ${address} which is not stored in wallet`
      );
    }
    this.activeAccount = this.accounts[address];
  }

  static generateAccountFromConfig() {
    if (!process.env.REACT_APP_PRIVATE_KEY)
      throw new Error("No environment variable found for private key");
    const privKey = process.env.REACT_APP_PRIVATE_KEY;
    return generateAccountFromPrivateKey(privKey);
  }

  private sign(message: any) {
    return arrayBufferToHex(
      secpSign(this.activeAccount?.privKey, message).toArrayBuffer()
    );
  }

  signTx(tx: Transaction) {
    const signatures: HexString[] = [];
    tx.txSkeleton.signingEntries.forEach((entry) => {
      signatures.push(this.sign(entry.message));
    });
    return signatures;
  }
}

export const walletService = new WalletService("local");
