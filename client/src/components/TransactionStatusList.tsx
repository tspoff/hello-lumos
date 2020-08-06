import React from "react";
import styled from "styled-components";
import { useContext } from "react";
import {
  TxTrackerContext,
  TxStatus,
  txStatusToText,
} from "../stores/TxTrackerStore";
import { Row, Col, Grid } from "./common/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { generateCkbExplorerLink } from "../utils/formatters";
import HashView from "./common/HashView";
import LoadingDots from "./common/LoadingDots";

const Wrapper = styled.div``;

export const TransactionStatusList = () => {
  const { txTrackerState } = useContext(TxTrackerContext);

  const numTx = Object.keys(txTrackerState.trackedTx).length;

  const renderListItems = () => {
    return Object.keys(txTrackerState.trackedTx).map((txHash) => {
      const txStatus = txTrackerState.trackedTx[txHash];
      return (
        <React.Fragment key={txHash}>
          <Row>
            <Col size={4}><HashView hash={txHash}/></Col>
            <Col size={2}>
              {txStatusToText(txStatus)}
              {txStatus === TxStatus.COMMITTED && (
                <a href={generateCkbExplorerLink(txHash)} rel="noopener noreferrer" target="_blank">
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
              )}
              {(txStatus === TxStatus.PENDING || txStatus === TxStatus.PROPOSED) && (
                  <LoadingDots />
              )}
              </Col>
          </Row>
        </React.Fragment>
      );
    });
  };

  return (
    <Wrapper>
      {numTx > 0 && (
        <React.Fragment>
          <h3>Your Transfers</h3>
          <Grid>{renderListItems()}</Grid>
        </React.Fragment>
      )}
    </Wrapper>
  );
};
