import React from "react";
import styled from "styled-components";
import { shortenAddress } from "../utils/formatters";
import Identicon from "./common/Identicon";
import { CenteredCol } from "./common/Grid";
import { CopyButtonWrapper, CopyButton } from "./common/CopyButton";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const CenteredColWithMargin = styled(CenteredCol)`
  margin-left: 10px;
`;

interface Props {
  address: string;
  shorten: boolean;
  copyButton?: boolean;
}

const AddressView = (props: Props) => {
  return (
    <Wrapper>
      <CenteredCol size={2}>
        <Identicon value={props.address} />
      </CenteredCol>
      <CenteredColWithMargin size={4}>
        <p>{props.shorten ? shortenAddress(props.address) : props.address}</p>
      </CenteredColWithMargin>
      <CenteredColWithMargin size={4}>
        {props.copyButton && (
            <CopyButton content={props.address} />
        )}
      </CenteredColWithMargin>
    </Wrapper>
  );
};
export default AddressView;
