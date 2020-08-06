import React from "react";
import styled from "styled-components";

const Button = styled.div`
    border-radius: 5px;
    padding: 10px;
    margin: 5px;
    font-size: 14px;
`;

const InactiveButton = (props) => {
  const { children } = props;

  return (
        <Button> 
            {children}
        </Button>
  );
};

export default InactiveButton;
