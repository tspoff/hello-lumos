import React from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import Header from "./components/Header";
import WalletModal from "./components/WalletModal";
import * as dotenv from "dotenv";
import { ModalStore } from "./stores/ModalStore";
import { BalanceStore } from "./stores/BalanceStore";
import { WalletStore } from "./stores/WalletStore";
import { HelloCkb } from "./pages/HelloCkb";
import { DataManager } from "./components/DataManager";
import { TxTrackerStore } from "./stores/TxTrackerStore";

dotenv.config();

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContentWrapper = styled.div`
  margin: 0 auto;
`;

function App() {
  return (
    <BalanceStore>
      <WalletStore>
        <ModalStore>
          <TxTrackerStore>
            <DataManager>
              <div className="App">
                <div className="app-shell">
                  <Header />
                  <WalletModal />
                  <Container>
                    <ContentWrapper>
                      <HashRouter>
                        <Switch>
                          <Route path="/hello-ckb" component={HelloCkb} />
                          <Redirect from="/" to="/hello-ckb" />
                        </Switch>
                      </HashRouter>
                    </ContentWrapper>
                  </Container>
                </div>
              </div>
            </DataManager>
          </TxTrackerStore>
        </ModalStore>
      </WalletStore>
    </BalanceStore>
  );
}

export default App;
