import { useContext, useEffect } from "react";

import { BalanceContext, BalanceActions } from "../stores/BalanceStore";
import { WalletContext, WalletActions } from "../stores/WalletStore";
import { dappService } from "../services/DappService";
import { walletService } from "../services/WalletService";
import React from "react";
import { useInterval } from "../hooks/useInterval";
import {
  TxTrackerContext,
  getPendingTx,
  TxTrackerActions,
} from "../stores/TxTrackerStore";

/* The DataManager fetches new data when it's needed. This takes the burden off the other components to handle data fetches, and placing that data in appropriate stores. Other components simply tell the fetcher the relevant update, and subscribe to the incoming state via contexts :) */
export const DataManager = ({ children }) => {
  const { balanceState, balanceDispatch } = useContext(BalanceContext);
  const { walletState, walletDispatch } = useContext(WalletContext);
  const { txTrackerState, txTrackerDispatch } = useContext(TxTrackerContext);

  const { activeAccount } = walletState;

  const fetchCkbBalance = async (activeAccount, balanceDispatch) => {
    if (activeAccount) {
      try {
        const balance = await dappService.fetchCkbBalance(
          activeAccount.lockScript
        );

        balanceDispatch({
          type: BalanceActions.SetCkbBalance,
          lockHash: activeAccount.lockHash,
          balance: balance,
        });
      } catch (error) {
        console.warn("fetchCkbBalance", error);
      }
    }
  };

  // Get accounts from wallet
  useEffect(() => {
    const activeAccount = walletService.getActiveAccount();
    const accounts = walletService.getAccounts();

    walletDispatch({
      type: WalletActions.addAccounts,
      accounts,
    });

    if (activeAccount) {
      walletDispatch({
        type: WalletActions.setActiveAccount,
        address: activeAccount.address,
      });
    }
  }, [walletDispatch]);

  // Fetch CKB Balance on active account change
  useEffect(() => {
    if (activeAccount) {
      (async () => {
        await fetchCkbBalance(activeAccount, balanceDispatch);
      })();
    }
  }, [activeAccount, balanceDispatch]);

  //Fetch tracked transaction status + ckb balance on block update
  useInterval(async () => {
    const latestBlock = await dappService.getLatestBlock();
    const pendingTx = getPendingTx(txTrackerState.trackedTx);

    if (latestBlock > txTrackerState.lastFetchedBlock && pendingTx.length > 0) {
      txTrackerDispatch({
        type: TxTrackerActions.SetLatestBlock,
        latestBlock,
      });

      const txStatuses = await dappService.fetchTransactionStatuses(pendingTx);
      txTrackerDispatch({
        type: TxTrackerActions.SetStatuses,
        txMap: txStatuses,
      });
      if (activeAccount) {
        await fetchCkbBalance(activeAccount, balanceDispatch);
      }
    }
  }, 1000);

  return <React.Fragment>{children}</React.Fragment>;
};
