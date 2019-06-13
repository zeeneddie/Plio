import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { prop } from 'ramda';

import { Icon } from '../../components';

const Wrapper = styled.div`
  min-height: 24px;
  width: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-shrink: 0;
  padding: 8px;
`;

const StyledIcon = styled(Icon)`
  height: 16px;
  width: 16px;
  padding: 2px;
  line-height: 12px;
  border-radius: 2px;
  display: block;
  text-align: center;
  color: ${prop('color')};
  transition: color .4s ease;
`;

const CanvasSquareIcon = ({ className, ...props }) => (
  <Wrapper {...{ className }}>
    <StyledIcon size="2" name="square" {...props} />
  </Wrapper>
);

CanvasSquareIcon.propTypes = {
  color: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default CanvasSquareIcon;
