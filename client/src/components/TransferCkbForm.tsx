import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import {
  FormWrapper,
  FormTitle,
  FormInput,
  FormError,
  Form,
} from "./common/Form";
import Button from "./common/Button";
import { dappService, CkbTransferParams } from "../services/DappService";
import { WalletContext } from "../stores/WalletStore";
import { getConfig } from "../config/lumosConfig";
import { TransactionStatusList } from "./TransactionStatusList";
import { toShannons } from "../utils/formatters";
import { walletService } from "../services/WalletService";
import {
  TxTrackerContext,
  TxTrackerActions,
  TxStatus,
} from "../stores/TxTrackerStore";

type Inputs = {
  recipientAddress: string;
  amount: string;
};

const TransferCkbForm = () => {
  const { walletState } = useContext(WalletContext);
  const { txTrackerState, txTrackerDispatch } = useContext(TxTrackerContext);

  const defaultTxFee = getConfig().DEFAULT_TX_FEE;

  const { register, handleSubmit, watch, errors } = useForm<Inputs>();
  const onSubmit = async (formData) => {
    if (!walletState.activeAccount) return;

    const params: CkbTransferParams = {
      sender: walletState.activeAccount.address,
      recipient: formData.recipientAddress,
      amount: toShannons(formData.amount),
      txFee: defaultTxFee,
    };

    const tx = await dappService.buildTransferCkbTx(params);

    const signatures = await walletService.signTransaction(
      tx,
      walletState.activeAccount.lockHash
    );
    const txHash = await dappService.transferCkb(params, signatures);

    txTrackerDispatch({
      type: TxTrackerActions.SetTrackedTxStatus,
      txHash,
      txStatus: TxStatus.PENDING,
    });
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Form>
        <FormTitle>Transfer CKB</FormTitle>
        <label htmlFor="recipientAddress">Recipient Address</label>
        <FormInput
          type="text"
          name="recipientAddress"
          ref={register({ required: true })}
        />
        {errors.recipientAddress && (
          <FormError>Please enter recipient address</FormError>
        )}
        <label htmlFor="amount">Amount</label>
        <FormInput
          type="number"
          name="amount"
          step="0.00000001"
          ref={register({ required: true })}
        />
        {errors.amount && <FormError>Please enter amount</FormError>}
        <Button disabled={!walletState.activeAccount} type="submit">
          Transfer
        </Button>
      </Form>
      <TransactionStatusList />
    </FormWrapper>
  );
};

export default TransferCkbForm;
