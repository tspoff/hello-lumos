import React, { useState } from "react";
import styled from "styled-components";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { Col } from "./Grid";

export const CopyButtonWrapper = styled(Col)`
  padding-left: 10px;
`;

interface Props {
  content: string;
}
/*
    Animated button for copying text
    Credit: https://stackoverflow.com/questions/24111813/how-can-i-animate-a-react-js-component-onclick-and-detect-the-end-of-the-animati
*/
export const CopyButton = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copied, setCopied] = useState(false);

  return (
    <button>
      <CopyToClipboard
        text={props.content}
        onClick={() => setCopied(true)}
        onAnimationEnd={() => setCopied(false)}
      >
        <div>
          <FontAwesomeIcon icon={faCopy} />
        </div>
      </CopyToClipboard>
    </button>
  );
};
