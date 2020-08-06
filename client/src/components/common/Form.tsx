import styled, { css } from "styled-components";

export const sharedStyles = css`
  height: 40px;
  border-radius: 5px;
  border: 1px solid #888;
  margin: 10px 0 20px 0;
  padding: 20px;
  box-sizing: border-box;
`;

export const FormWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
`;
export const Form = styled.form`
  width: 100%;
  padding: 40px;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
`;

export const FormTitle = styled.h2``;
export const FormInput = styled.input`
  width: 100%;
  ${sharedStyles};
`;
export const FormError = styled.div``;
