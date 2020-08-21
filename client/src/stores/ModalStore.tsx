import React, { createContext, useReducer } from "react";
import { Transaction } from "../services/DappService";
import _ from "lodash";

/*
  Store visibility and persistent state for application Modals
*/
export interface Modal {
  visible: boolean;
}

export interface WalletModal extends Modal {
  activePanel?: WalletModalPanels;
  txToSign?: Transaction;
  error?: string;
}

interface State {
  walletModal: WalletModal;
}

export enum WalletModalPanels {
  VIEW_ACCOUNT,
  CONNECT_ACCOUNT,
}

export enum Modals {
  walletModal = "walletModal",
}

export enum ModalActions {
  setModalState = "setModalState",
}

const initialState: State = {
  walletModal: {
    visible: false,
    activePanel: WalletModalPanels.CONNECT_ACCOUNT,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case ModalActions.setModalState:
      return setModalState(state, action.modalName, action.newState);
    default:
      return state;
  }
};

const setModalState = (state, modalName: string, modalState: Modal) => {
  const newState = _.cloneDeep(state);
  newState[modalName] = { ...state[modalName], ...modalState };
  newState[modalName].error = undefined; // Clear Error
  return newState;
};

export interface ContextProps {
  modalState: State;
  modalDispatch: any;
}

export const ModalContext = createContext({} as ContextProps);

export const ModalStore = ({ children }) => {
  const [modalState, modalDispatch] = useReducer(reducer, initialState);
  const value: ContextProps = { modalState, modalDispatch };
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
