import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import AddressView from "../AddressView";
import CkbValue from "./CkbValue";

interface Props {
  amount: string;
  sender: string;
  recipient: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const RecipientRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const RecipientRowItem = styled.div`
  margin: auto 10px;
`;

const CkbTransferView = (props: Props) => {
  return (
    <Wrapper>
      <RecipientRow>
        <RecipientRowItem>
          <AddressView shorten copyButton address={props.sender} />
        </RecipientRowItem>
        <RecipientRowItem>
          <FontAwesomeIcon icon={faArrowRight} />
        </RecipientRowItem>
        <RecipientRowItem>
          <AddressView shorten copyButton address={props.recipient} />
        </RecipientRowItem>
        <RecipientRowItem>
          <CkbValue amount={props.amount} />
        </RecipientRowItem>
      </RecipientRow>
    </Wrapper>
  );
};

export default CkbTransferView;
