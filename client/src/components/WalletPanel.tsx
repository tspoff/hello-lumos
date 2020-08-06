import React, { useContext } from "react";
import AddressPillbox from "./AddressPillbox";
import { Modals, ModalActions, ModalContext, WalletModalPanels } from "../stores/ModalStore";
import { WalletContext } from "../stores/WalletStore";

const WalletPanel = () => {
  const {walletState} = useContext(WalletContext);
  const {modalDispatch} = useContext(ModalContext);

  let walletText = {
    address: "-",
  };

  const openWalletModal = () => {
    modalDispatch({
      type: ModalActions.setModalState,
      modalName: Modals.walletModal,
      newState: { visible: true, activePanel: WalletModalPanels.VIEW_ACCOUNT },
    });
  };

  if (walletState.activeAccount) {
    walletText.address = walletState.activeAccount.address;
  }

  return (
    <AddressPillbox
      shorten
      onClick={openWalletModal}
      address={walletText.address}
    />
  );
};

export default WalletPanel;
