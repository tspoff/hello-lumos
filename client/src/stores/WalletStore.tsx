/*
    Accounts are stored in the in-memory wallet
    The user can switch between stored accounts at-will
*/
import _ from "lodash";
import { Account } from "../utils/Account";
import React, { createContext, useReducer } from "react";

// UDT Typehash -> Owner Lockhash -> Amount
export interface AccountMap {
  [index: string]: Account;
}

interface State {
  accounts: AccountMap;
  activeAccount: Account | null;
}

export const initialState: State = {
  accounts: {} as AccountMap,
  activeAccount: null,
};

export enum WalletActions {
  addAccounts = "addAccounts",
  setActiveAccount = "setActiveAccount",
}

export const reducer = (state, action) => {
  switch (action.type) {
    case WalletActions.addAccounts:
      return addAccounts(state, action.accounts);
    case WalletActions.setActiveAccount:
      return setActiveAccount(state, action.address);
    default:
      return state;
  }
};

export const addAccounts = (state, accounts: AccountMap) => {
  const newState = _.cloneDeep(state);
  Object.keys(accounts).forEach(key => {
    newState.accounts[accounts[key].address] = accounts[key];
  });
  return newState;
};

export const setActiveAccount = (state: State, address: string) => {
  const account = state.accounts[address];
  const newState = _.cloneDeep(state);
  if (account) {
    newState.activeAccount = account;
  } else {
    throw new Error(`Account with address ${address} not found`);
  }
  return newState;
};

export interface ContextProps {
  walletState: State,
  walletDispatch: any
}

export const WalletContext = createContext({} as ContextProps);

export const WalletStore = ({ children }) => {
  const [walletState, walletDispatch] = useReducer(reducer, initialState);
  const value: ContextProps = {walletState, walletDispatch};
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
