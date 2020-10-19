import PropTypes from 'proptypes';
import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledButton = styled.button`
  background-color: #3c3a5e;
  border: 0;
  color: #feafff;
  cursor: pointer;
  padding: 10px;
  transition: all 0.08s linear;

  > * {
    transition: all 0.08s linear;
  }

  &:active {
    > * {
      transform: scale(0.95) !important;
    }
  }

  &:focus {
    outline: none;
  }

  &:hover {
    > * {
      transform: scale(1.05);
    }
  }

  ${({ selectable, selected }) =>
    selectable &&
    !selected &&
    `
      filter: brightness(0.4);
  `}
`;

const StyledLabel = styled.label`
  font-size: 0.6em;
  left: 50%;
  position: absolute;
  text-align: center;
  top: 70px;
  transform: translateX(-50%);
  user-select: none;
`;

const ActionButton = ({
  children,
  label,
  onClick,
  selectable,
  selected,
  ...props
}) => (
  <StyledWrapper>
    <StyledButton
      onClick={onClick}
      selectable={selectable}
      selected={selected}
      {...props}
    >
      {children}
    </StyledButton>

    <StyledLabel>{label}</StyledLabel>
  </StyledWrapper>
);

ActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
};

ActionButton.defaultProps = {
  selectable: false,
  selected: false,
};

export default ActionButton;
