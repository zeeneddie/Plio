import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import cx from 'classnames';

import { Icon } from '../../components';
import { canvasIconStyles } from '../styled';

const ChartButton = ({ className, icon, ...props }) => (
  <Button className={cx('btn-link', className)} color="chart" {...props}>
    <Icon name={icon} />
  </Button>
);

ChartButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
};

const CanvasChartButton = styled(ChartButton)`
  ${canvasIconStyles};
`;

export default CanvasChartButton;
