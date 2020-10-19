import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  background-color: #3c3a5e;
  border: 0;
  // border-bottom: 1px dashed #feafff;
  // border-top-left-radius: 2px;
  // border-top-right-radius: 2px;
  border-radius: 2px;
  color: #f8dff8;
  font-family: 'Minecraft';
  font-size: 1em;
  padding: 10px 0 2px 0;
  text-align: center;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

const Input = ({ ...props }) => <StyledInput {...props} />;

export default Input;
