import _ from "lodash";
import React, { createContext, useReducer } from "react";

export interface BalanceMap {
  [index: string]: bigint;
}

export interface State {
  ckbBalances: BalanceMap;
}

export const initialState = {
  ckbBalances: {} as BalanceMap,
};

export enum BalanceActions {
  SetCkbBalance = "setCkbBalance",
}

export const reducer = (state, action) => {
  switch (action.type) {
    case BalanceActions.SetCkbBalance:
      return setCkbBalance(state, action.lockHash, action.balance);

    default:
      return state;
  }
};

export const setCkbBalance = (state, address: string, balance: BigInt) => {
  const newState = _.cloneDeep(state);
  _.set(newState.ckbBalances, `${address}`, balance);
  return newState;
};

export interface ContextProps {
  balanceState: State;
  balanceDispatch: any;
}

export const BalanceContext = createContext({} as ContextProps);

export const BalanceStore = ({ children }) => {
  const [balanceState, balanceDispatch] = useReducer(reducer, initialState);
  const value: ContextProps = { balanceState, balanceDispatch };
  return (
    <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
  );
};
