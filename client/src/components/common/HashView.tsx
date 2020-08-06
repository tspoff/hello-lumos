import React from "react";
import { shortenAddress } from "../../utils/formatters";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from "./Grid";

interface Props {
  hash: string;
}

const HashView = (props: Props) => {
  return (
    <React.Fragment>
      <Row>
        <Col>{shortenAddress(props.hash.toString())}</Col>
        <Col>
          <CopyToClipboard text={props.hash}>
            <FontAwesomeIcon icon={faCopy} />
          </CopyToClipboard>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default HashView;
