import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { Styles } from '../../../../api/constants';
import { Icon } from '../../components';

const StyledCanvasLinkedItem = styled.div`
  overflow: hidden;
  color: ${Styles.color.muted};
  line-height: 1.4;
  padding: 2px 7px 5px 7px;
  display: flex;
  margin-left: -30px;

  i {
    line-height: inherit;
    float: left;
    margin-right: 5px;
  }
`;

const CanvasLinkedItem = ({ children, ...props }) => (
  <StyledCanvasLinkedItem {...props}>
    <Icon name="long-arrow-right" />
    <div>{children}</div>
  </StyledCanvasLinkedItem>
);

CanvasLinkedItem.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default CanvasLinkedItem;
