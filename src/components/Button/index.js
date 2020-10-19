import { darken } from 'polished';
import PropTypes from 'proptypes';
import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  border-style: dashed;
  border-width: 2px;
  cursor: pointer;
  font-family: 'Minecraft';
  font-size: 1em;
  line-height: 1;
  padding: 15px 8px 9px 8px;
  transition: transform 0.08s linear;
  user-select: none;
  width: 100%;

  &:active {
    transform: scale(0.98) !important;
  }

  &:hover {
    transform: scale(1.02);
  }

  ${({ styleType, color }) =>
    styleType === 'bordered' &&
    `
    background-color: transparent;
    border-color: ${color};
    color: ${color};

    &:focus {
      outline: none;
    }
  `};

  ${({ styleType, color }) =>
    styleType === 'filled' &&
    `
    color: ${darken(0.5, color)};
    background-color: ${color};
    border-color: transparent;

    &:focus {
      outline: none;
    }
  `};
`;

const Button = ({
  children,
  className,
  color,
  onClick,
  styleType,
  ...rest
}) => (
  <StyledButton
    className={className}
    color={color}
    onClick={onClick}
    styleType={styleType}
    {...rest}
  >
    {children}
  </StyledButton>
);

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  className: PropTypes.string,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  styleType: PropTypes.oneOf(['bordered', 'filled', 'unbordered']).isRequired,
};

Button.defaultProps = {
  className: '',
  onClick: () => {},
};

export default Button;
