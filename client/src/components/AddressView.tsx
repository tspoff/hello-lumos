import React from "react";
import styled from "styled-components";
import { shortenAddress } from "../utils/formatters";
import Identicon from "./common/Identicon";
import { CenteredCol } from "./common/Grid";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CenteredColWithMargin = styled(CenteredCol)`
  margin-left: 10px;
`;

const AddressView = (props) => {
  return (
    <Wrapper>
      <CenteredCol size={2}>
        <Identicon value={props.address} />
      </CenteredCol>
      <CenteredColWithMargin size={4}>
        <p>{props.shorten ? shortenAddress(props.address) : props.address}</p>
      </CenteredColWithMargin>
    </Wrapper>
  );
};
export default AddressView;
