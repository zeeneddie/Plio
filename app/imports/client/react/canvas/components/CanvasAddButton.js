import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { Button } from 'reactstrap';
import styled from 'styled-components';

import { Icon } from '../../components';

import { canvasIconStyles } from '../styled';

const CanvasAddButton = ({ className, ...props }) => (
  <Button className={cx('btn-link', className)} color="add" {...props}>
    <Icon name="plus" />
  </Button>
);

CanvasAddButton.propTypes = {
  className: PropTypes.string,
};

const StyledCanvasAddButton = styled(CanvasAddButton)`
  ${canvasIconStyles}
`;

export default StyledCanvasAddButton;
