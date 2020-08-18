import React, { useContext } from "react";
import WalletPillbox from "./WalletPillbox";
import {
  Modals,
  ModalActions,
  ModalContext,
  WalletModalPanels,
} from "../stores/ModalStore";
import { WalletContext } from "../stores/WalletStore";

const WalletPanel = () => {
  const { walletState } = useContext(WalletContext);
  const { modalDispatch } = useContext(ModalContext);

  let walletText = {
    address: "-",
  };

  const openWalletModal = () => {
    if (walletState.activeAccount) {
      modalDispatch({
        type: ModalActions.setModalState,
        modalName: Modals.walletModal,
        newState: {
          visible: true,
          activePanel: WalletModalPanels.VIEW_ACCOUNT,
        },
      });
    } else {
      modalDispatch({
        type: ModalActions.setModalState,
        modalName: Modals.walletModal,
        newState: {
          visible: true,
          activePanel: WalletModalPanels.CONNECT_ACCOUNT,
        },
      });
    }
  };

  if (walletState.activeAccount) {
    walletText.address = walletState.activeAccount.address;
  }

  return (
    <React.Fragment>
      {walletState.activeAccount && (
        <WalletPillbox
          shorten
          identicon
          onClick={openWalletModal}
          address={walletText.address}
        />
      )}
      {!walletState.activeAccount && (
        <WalletPillbox
          onClick={openWalletModal}
          address={'Connect'}
        />
      )}
    </React.Fragment>
  );
};

export default WalletPanel;
