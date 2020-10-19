import PropTypes from 'proptypes';
import React from 'react';
import styled from 'styled-components';

const StyledHr = styled.hr`
  border: 0;
  border-bottom: 1px dashed #876a87;
  border-top: 1px dashed #876a87;
  height: 3px;
  width: 100%;

  ${({ margin }) =>
    margin &&
    `
    margin: ${margin};
  `};
`;

const Hr = ({ margin }) => <StyledHr margin={margin} />;

Hr.propTypes = {
  margin: PropTypes.string,
};

Hr.defaultProps = {
  margin: '',
};

export default Hr;
