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
import { dappService } from "../services/DappService";
import { WalletContext } from "../stores/WalletStore";
import { BalanceContext } from "../stores/BalanceStore";
import { getConfig } from "../config/lumosConfig";
import { ModalContext, ModalActions, Modals, WalletModalPanels } from "../stores/ModalStore";
import { TransactionStatusList } from "./TransactionStatusList";
import { toShannons } from "../utils/formatters";

type Inputs = {
  recipientAddress: string;
  amount: string;
};

const TransferCkbForm = () => {
  const { modalDispatch } = useContext(ModalContext);
  const { walletState } = useContext(WalletContext);
  const { balanceState } = useContext(BalanceContext);

  const defaultTxFee = getConfig().DEFAULT_TX_FEE;

  const { register, handleSubmit, watch, errors } = useForm<Inputs>();
  const onSubmit = async (formData) => {
    if (!walletState.activeAccount) return;

    const txSkeleton = await dappService.buildTransferCkbTx(
      walletState.activeAccount.address,
      formData.recipientAddress,
      toShannons(formData.amount),
      defaultTxFee
    );

    modalDispatch({
      type: ModalActions.setModalState,
      modalName: Modals.walletModal,
      newState: {
        visible: true,
        activePanel: WalletModalPanels.SIGN_TX,
        txToSign: txSkeleton
      }
    })
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
