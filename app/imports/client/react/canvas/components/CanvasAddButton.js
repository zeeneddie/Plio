import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { Button } from 'reactstrap';
import styled from 'styled-components';

import { Icon } from '../../components';

import { canvasIconStyles } from '../styled';

const CanvasAddButton = ({ className, icon = 'plus', ...props }) => (
  <Button className={cx('btn-link', className)} color="add" {...props}>
    <Icon name={icon} />
  </Button>
);

CanvasAddButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
};

const StyledCanvasAddButton = styled(CanvasAddButton)`
  ${canvasIconStyles}
`;

export default StyledCanvasAddButton;
