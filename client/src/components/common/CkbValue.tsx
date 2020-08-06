import React from "react";
import styled from "styled-components";
import { formatBalance } from "../../utils/formatters";

interface Props {
  amount: string | null;
  showPlaceholder?: boolean;
}

const CkbValue = (props: Props) => {
  if (props.showPlaceholder) {
    return <React.Fragment>- CKB</React.Fragment>;
  } else if (props.amount) {
    return <React.Fragment>{formatBalance(props.amount.toString())} CKB</React.Fragment>;
  } else {
    throw new Error('CkbValue component requires either a valid amount or the showPlaceholder flag');
  }
};

export default CkbValue;
