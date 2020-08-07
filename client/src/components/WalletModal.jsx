import React, { useEffect, useContext } from "react";
import styled from "styled-components";
import JSONPretty from "react-json-pretty";
import { Grid, Row, Col, CenteredRow, CenteredCol } from "./common/Grid";
import Modal from "./common/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTimes,
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";
import AddressPillbox from "./AddressPillbox";
import AddressView from "./AddressView";
import CkbTransfer from "./common/CkbTransferView";
import JSONPrettyMon from "react-json-pretty/dist/monikai";
import ActionButton from "./common/ActionButton";
import { walletService } from "../services/WalletService";
import {
  WalletActions,
  WalletContext,
  setActiveAccount,
} from "../stores/WalletStore";
import {
  Modals,
  ModalActions,
  ModalContext,
  WalletModalPanels,
} from "../stores/ModalStore";
import { BalanceContext } from "../stores/BalanceStore";
import CkbValue from "./common/CkbValue";
import { dappService } from "../services/DappService";
import {
  TxTrackerContext,
  TxTrackerActions,
  TxStatus,
} from "../stores/TxTrackerStore";

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderRow = styled(Row)`
  padding: 10px 0px;
  padding-top: 20px;
  border-bottom: 1px solid black;
`;

const ContentRow = styled(Row)`
  padding: 10px 0px;
`;

const ContentCentered = styled.div`
  text-align: center;
  margin: auto;
`;

const JsonWrapper = styled.div`
  text-align: left;
  max-height: 400px;
  width: 64vh;
  margin: auto;
  padding-left: 10px;
  overflow: scroll;
`;

const ErrorMsg = styled.p`
  color: red;
`;

const WalletModal = () => {
  const { walletState } = useContext(WalletContext);
  const { balanceState } = useContext(BalanceContext);
  const { modalState, modalDispatch } = useContext(ModalContext);
  const { txTrackerDispatch } = useContext(TxTrackerContext);

  const dismissModal = () => {
    modalDispatch({
      type: ModalActions.setModalState,
      modalName: Modals.walletModal,
      newState: { visible: false },
    });
  };

  const signProposal = async () => {
    const tx = modalState.walletModal.txToSign;
    if (!tx) return;
    const signatures = await walletService.signTx(tx);

    try {
      const txHash = await dappService.transferCkb(tx.params, signatures);

      txTrackerDispatch({
        type: TxTrackerActions.SetTrackedTxStatus,
        txHash,
        txStatus: TxStatus.PENDING,
      });

      modalDispatch({
        type: ModalActions.setModalState,
        modalName: Modals.walletModal,
        newState: { visible: false },
      });
    } catch (error) {
      console.error(error);
      modalDispatch({
        type: ModalActions.setError,
        modalName: Modals.walletModal,
        error,
      });
    }
  };

  let walletText = {
    address: "-",
    pubKeyHash: "-",
    lockHash: "-",
    balance: "-",
    title: "-",
  };

  const account = walletState.activeAccount;
  let balance = null;

  /* Display balance if already fetched */
  if (account && balanceState.ckbBalances[account.lockHash]) {
    balance = balanceState.ckbBalances[account.lockHash].toString();
  }

  /* Set wallet text based on active wallet */
  if (account) {
    walletText.address = account.address;
    walletText.pubKeyHash = account.pubKeyHash;
    walletText.lockHash = account.lockHash;
  }

  switch (modalState.walletModal.activePanel) {
    case WalletModalPanels.SIGN_TX:
      walletText.title = "Signature Request";
      break;
    case WalletModalPanels.VIEW_ACCOUNT:
      walletText.title = "Active Account";
      break;
    default:
      walletText.title = "Unknown Panel";
  }

  const renderActivePanel = () => {
    switch (modalState.walletModal.activePanel) {
      case WalletModalPanels.SIGN_TX:
        walletText.title = "Transfer CKB";
        return renderWalletSignPanel();
      case WalletModalPanels.VIEW_ACCOUNT:
        return renderWalletInfoPanel();
      default:
        return renderWalletInfoPanel();
    }
  };

  const renderWalletSignPanel = () => {
    const { params, txSkeleton } = modalState.walletModal.txToSign;

    return (
      <React.Fragment>
        <ContentRow>
          <ContentCentered>
            <h4>CKB Transfer</h4>
            <CkbTransfer
              sender={params.sender}
              recipient={params.recipient}
              amount={params.amount.toString()}
            />
          </ContentCentered>
        </ContentRow>
        <ContentRow>
          <ContentCentered>
            <h4>Transaction Details</h4>
            <JsonWrapper>
              <JSONPretty
                data={JSON.stringify(txSkeleton)}
                theme={JSONPrettyMon}
              />
            </JsonWrapper>
            <ActionButton onClick={signProposal}>
              Approve <FontAwesomeIcon icon={faFileSignature} />
            </ActionButton>
          </ContentCentered>
        </ContentRow>
      </React.Fragment>
    );
  };

  const renderWalletInfoPanel = () => {
    return (
      <React.Fragment>
        <CenteredRow>
          <AddressView address={walletText.address} copyButton />
        </CenteredRow>
        <CenteredRow>
          <p>
            Ckb Balance:{" "}
            <CkbValue amount={balance} showPlaceholder={!balance} />
          </p>
        </CenteredRow>
      </React.Fragment>
    );
  };

  const walletError = modalState[Modals.walletModal].error;

  //@ts-ignore
  return (
    <Modal
      onDismiss={dismissModal}
      visible={modalState[Modals.walletModal].visible}
    >
      <ModalWrapper>
        <Grid>
          <HeaderRow>
            <Col size={14}>{walletText.title}</Col>
            <Col size={2}>
              <FontAwesomeIcon onClick={dismissModal} icon={faTimes} />
            </Col>
          </HeaderRow>
          {renderActivePanel()}
          {walletError && (
            <CenteredRow>
              <ErrorMsg>{walletError.toString()}</ErrorMsg>
            </CenteredRow>
          )}
        </Grid>
      </ModalWrapper>
    </Modal>
  );
};

export default WalletModal;
