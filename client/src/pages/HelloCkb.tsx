import React, { useContext } from "react";
import { BalanceContext } from "../stores/BalanceStore";
import { WalletContext } from "../stores/WalletStore";
import TransferCkbForm from "../components/TransferCkbForm";
import CkbValue from "../components/common/CkbValue";
import { Grid } from "../components/common/Grid";

export const HelloCkb = () => {
  const { balanceState } = useContext(BalanceContext);
  const { walletState } = useContext(WalletContext);

  let balance: string | null = null;

  if (
    walletState.activeAccount &&
    balanceState.ckbBalances[walletState.activeAccount.lockHash]
  ) {
    balance = balanceState.ckbBalances[
      walletState.activeAccount.lockHash
    ].toString();
  }

  return (
    <Grid>
      <h1>Hello Lumos!</h1>
      <h3>
        Your Ckb Balance:{" "}
        <CkbValue amount={balance} showPlaceholder={!balance} />
      </h3>
      <TransferCkbForm />
    </Grid>
  );
};
