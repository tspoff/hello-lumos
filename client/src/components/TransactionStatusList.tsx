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

const Wrapper = styled.div`
  border-radius: 5px;
`;

const TableRow = styled.div`
  display: flex;
  justify-content: center;
`;

const TableItemLeft = styled(Col)`
  padding: 10px 0px;
  border-left: 1px solid black;
`;

const TableItemRight = styled(Col)`
  padding: 10px 0px;
  border-left: 1px solid black;
  border-right: 1px solid black;
`;

const StatusWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StatusItem = styled(Col)``;

const StatusLink = styled.a`
padding-left: 5px;
`;

export const TransactionStatusList = () => {
  const { txTrackerState } = useContext(TxTrackerContext);

  const numTx = Object.keys(txTrackerState.trackedTx).length;

  const renderListItems = () => {
    return Object.keys(txTrackerState.trackedTx).map((txHash) => {
      const txStatus = txTrackerState.trackedTx[txHash];
      return (
        <React.Fragment key={txHash}>
          <TableRow>
            <TableItemLeft size={10}>
              <HashView hash={txHash} />
            </TableItemLeft>
            <TableItemRight size={4}>
              <StatusWrapper>
                <StatusItem>
                  {txStatusToText(txStatus)}{" "}
                  {(txStatus === TxStatus.PENDING ||
                    txStatus === TxStatus.PROPOSED) && <LoadingDots />}
                </StatusItem>
                {txStatus === TxStatus.COMMITTED && (
                  <StatusItem>
                    <StatusLink
                      href={generateCkbExplorerLink(txHash)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </StatusLink>
                  </StatusItem>
                )}
              </StatusWrapper>
            </TableItemRight>
          </TableRow>
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
