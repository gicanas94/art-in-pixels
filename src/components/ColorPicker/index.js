import PropTypes from 'proptypes';
import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  border: 1px solid #000000;
  display: flex;
  flex-direction: column;
  height: 56.66px;
  transition: all 0.08s linear;
  user-select: none;
  width: 100%;

  ${({ selected }) =>
    selected &&
    `
    border: 3px solid #ff0000;
  `}
`;

const StyledVisibleColor = styled.div`
  height: 70%;

  ${({ selectable }) =>
    selectable &&
    `
    cursor: pointer;
  `}
`;

const StyledInputAndEditColorWrapper = styled.div`
  background-color: #000000;
  height: 30%;
  padding: 5px 0;
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  bottom: 0;
  cursor: pointer;
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  width: 100%;
`;

const StyledEditColor = styled.div`
  align-items: center;
  bottom: 0;
  color: #ffffff;
  display: flex;
  font-size: 0.6em;
  justify-content: center;
  left: 0;
  line-height: 1;
  pointer-events: none;
  width: 100%;
`;

const ColorPicker = ({ color, onChange, onSelect, selected }) => (
  <StyledWrapper selected={selected}>
    <StyledVisibleColor
      onClick={onSelect ? () => onSelect(color) : null}
      selectable={onSelect}
      style={{ backgroundColor: color }}
    />

    <StyledInputAndEditColorWrapper>
      <StyledInput onChange={onChange} type="color" value={color} />

      <StyledEditColor>edit</StyledEditColor>
    </StyledInputAndEditColorWrapper>
  </StyledWrapper>
);

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
};

ColorPicker.defaultProps = {
  onSelect: null,
  selected: false,
};

export default ColorPicker;
