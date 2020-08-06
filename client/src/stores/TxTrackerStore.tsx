import _ from "lodash";
import React, { createContext, useReducer } from "react";

/* 
  Store visibility and persistent state for application Modals
*/
type TxHash = string;

export enum TxStatus {
  PENDING = "pending",
  PROPOSED = "proposed",
  COMMITTED = "committed",
}

export const txStatusToText = (status: TxStatus) => {
  switch (status) {
    case TxStatus.PENDING:
      return "Pending";
    case TxStatus.PROPOSED:
      return "Proposed";
    case TxStatus.COMMITTED:
      return "Committed";
    default:
      return "Unknown";
  }
};

export interface TxMap {
  [index: string]: TxStatus;
}

interface State {
  trackedTx: TxMap;
  lastFetchedBlock: number;
}

export enum TxTrackerActions {
  SetTrackedTxStatus = "SetTrackedTxStatus",
  SetStatuses = "SetStatuses",
  SetLatestBlock = "SetLatestBlock",
}

const initialState: State = {
  trackedTx: {} as TxMap,
  lastFetchedBlock: -1,
};

export const getPendingTx = (txs: TxMap) => {
  return Object.keys(txs).filter((txHash) => {
    return txs[txHash] === TxStatus.PENDING || txs[txHash] === TxStatus.PROPOSED;
  });
};

const reducer = (state, action) => {
  switch (action.type) {
    case TxTrackerActions.SetTrackedTxStatus:
      return setTrackedTxStatus(state, action.txHash, action.txStatus);
    case TxTrackerActions.SetStatuses:
      return setStatuses(state, action.txMap);
    case TxTrackerActions.SetLatestBlock:
      return setLatestBlock(state, action.latestBlock);
    default:
      return state;
  }
};

const setLatestBlock = (state: State, latestBlock: number): State => {
  const newState = _.cloneDeep(state);
  newState.lastFetchedBlock = latestBlock;
  return newState;
};

const setTrackedTxStatus = (
  state,
  txHash: TxHash,
  txStatus: TxStatus
): State => {
  const newState = _.cloneDeep(state);
  newState.trackedTx[txHash] = txStatus;
  return newState;
};

const setStatuses = (state: State, txMap: TxMap): State => {
  const newState = _.cloneDeep(state);
  newState.trackedTx = { ...newState.trackedTx, ...txMap,  };
  return newState;
};

export interface ContextProps {
  txTrackerState: State;
  txTrackerDispatch: any;
}

export const TxTrackerContext = createContext({} as ContextProps);

export const TxTrackerStore = ({ children }) => {
  const [txTrackerState, txTrackerDispatch] = useReducer(reducer, initialState);
  const value: ContextProps = { txTrackerState, txTrackerDispatch };
  return (
    <TxTrackerContext.Provider value={value}>
      {children}
    </TxTrackerContext.Provider>
  );
};
