import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { Styles } from '../../../../api/constants';
import { Icon } from '../../components';

const CanvasLinkedItem = ({ children, ...props }) => (
  <div {...props}>
    <Icon name="long-arrow-right" />
    {children}
  </div>
);

CanvasLinkedItem.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const StyledCanvasLinkedItem = styled(CanvasLinkedItem)`
  overflow: hidden;
  color: ${Styles.color.muted};
  line-height: 1.4;
  padding: 2px 7px 5px 7px;

  i {
    line-height: inherit;
    float: left;
    margin-right: 5px;
  }
`;

export default StyledCanvasLinkedItem;
