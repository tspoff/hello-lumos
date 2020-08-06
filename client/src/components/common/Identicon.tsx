import React from "react";
import { Hashicon } from "@emeraldpay/hashicon-react";

const Identicon = (props) => {
  return <Hashicon value={props.value} size={30} />;
};

export default Identicon;
