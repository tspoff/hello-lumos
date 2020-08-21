import React from "react";
import Button from "./Button";

const ActionButton = (props) => {
  const { children, onClick } = props;

  return (
        <Button onClick={onClick}>
            {children}
        </Button>
  );
};

export default ActionButton;
