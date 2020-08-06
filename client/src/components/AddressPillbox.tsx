import React from "react";
import styled from "styled-components";
import AddressView from "./AddressView";

const Wrapper = styled.div`
  padding: 0px 10px;
  border-radius: 10px;
  border: 1px solid black;
  display: flex;
  justify-content: space-between;
`;

const AddressPillbox = (props) => {
  return (
    <Wrapper onClick={props.onClick}>
          <AddressView shorten={props.shorten ? true : false} address={props.address}/>
    </Wrapper>
  );
};
export default AddressPillbox;
