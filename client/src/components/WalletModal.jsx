import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Grid, Row, Col, CenteredRow } from "./common/Grid";
import Modal from "./common/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import AddressView from "./AddressView";
import { walletService } from "../services/WalletService";
import { WalletActions, WalletContext } from "../stores/WalletStore";
import {
  Modals,
  ModalActions,
  ModalContext,
  WalletModalPanels,
} from "../stores/ModalStore";
import { BalanceContext } from "../stores/BalanceStore";
import CkbValue from "./common/CkbValue";
import { WalletConnectCard } from "./WalletConnectCard";

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderRow = styled(Row)`
  padding: 10px 0px;
  padding-top: 20px;
  border-bottom: 1px solid black;
`;

const ErrorMsg = styled.p`
  color: red;
`;

const ContentWrapper = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const WalletModal = () => {
  const { walletState, walletDispatch } = useContext(WalletContext);
  const { balanceState } = useContext(BalanceContext);
  const { modalState, modalDispatch } = useContext(ModalContext);
  const [error, setError] = useState("");

  const dismissModal = () => {
    modalDispatch({
      type: ModalActions.setModalState,
      modalName: Modals.walletModal,
      newState: { visible: false },
    });
  };

  let walletText = {
    address: "-",
    pubKeyHash: "-",
    lockHash: "-",
    balance: "-",
    title: "-",
  };

  const keyperringAuthRequest = async () => {
    try {
      setError("");

      const token = await walletService.requestAuth(
        "Hello Lumos - Connection Request"
      );

      walletService.setToken(token);

      const accounts = await walletService.getAccounts();
      const activeAccount = accounts[0]; // Secp256k1 lock script for address

      // Add account info to local store
      walletDispatch({
        type: WalletActions.addAccounts,
        accounts,
      });

      walletDispatch({
        type: WalletActions.setActiveAccount,
        lockHash: activeAccount.lockHash,
      });

      // Change modal to show connection success
      modalDispatch({
        type: ModalActions.setModalState,
        modalName: Modals.walletModal,
        newState: { activePanel: WalletModalPanels.VIEW_ACCOUNT },
      });
    } catch (e) {
      setError("Wallet authorization refused");
    }
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
    case WalletModalPanels.CONNECT_ACCOUNT:
      walletText.title = "Connect to Wallet";
      break;
    case WalletModalPanels.VIEW_ACCOUNT:
      walletText.title = "Active Account";
      break;
    default:
      walletText.title = "Unknown Panel";
  }

  const renderActivePanel = () => {
    switch (modalState.walletModal.activePanel) {
      case WalletModalPanels.CONNECT_ACCOUNT:
        return renderWalletConnectPanel();
      case WalletModalPanels.VIEW_ACCOUNT:
        return renderWalletInfoPanel();
      default:
        return renderWalletInfoPanel();
    }
  };

  const renderWalletConnectPanel = () => {
    return (
      <React.Fragment>
        <CenteredRow>
          <WalletConnectCard
            name={"Keypering"}
            onClick={keyperringAuthRequest}
          />
        </CenteredRow>
      </React.Fragment>
    );
  };

  const renderWalletInfoPanel = () => {
    return (
      <React.Fragment>
        <CenteredRow>
          <AddressView address={walletText.address} copyButton identicon />
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

  //@ts-ignore
  return (
    <Modal
      onDismiss={dismissModal}
      visible={modalState[Modals.walletModal].visible}
    >
      <ModalWrapper>
        <Grid>
          <HeaderRow>
            <Col size={15}>
              <p>{walletText.title}</p>
            </Col>
            <Col size={1}>
              <FontAwesomeIcon onClick={dismissModal} icon={faTimes} />
            </Col>
          </HeaderRow>
          <ContentWrapper>{renderActivePanel()}</ContentWrapper>
          {error && (
            <CenteredRow>
              <ErrorMsg>{error}</ErrorMsg>
            </CenteredRow>
          )}
        </Grid>
      </ModalWrapper>
    </Modal>
  );
};

export default WalletModal;
