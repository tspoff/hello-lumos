import React from "react";
import styled from "styled-components";
import { shortenAddress } from "../../utils/formatters";
import { CopyButton, CopyButtonWrapper } from "./CopyButton";
import { Col } from "./Grid";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
interface Props {
  hash: string;
}

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const HashView = (props: Props) => {
  console.log(props);
  return (
    <React.Fragment>
      <Wrapper>
        <ItemWrapper>
        <Col size={6}>{shortenAddress(props.hash.toString())}</Col>
        <CopyButtonWrapper size={1}>
          <CopyButton content={props.hash} />
        </CopyButtonWrapper>
        </ItemWrapper>
      </Wrapper>
    </React.Fragment>
  );
};

export default HashView;
