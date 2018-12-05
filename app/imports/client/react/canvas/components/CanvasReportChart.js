import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Styles } from '../../../../api/constants';
import { Icon } from '../../components';
import CanvasReportHeader from './CanvasReportHeader';

const ChartWrapper = styled.div`
  max-width: 250px;
  margin: 0 auto 15px;
  position: relative;
  & > div {
    padding: 0;
  }
  i {
    position: absolute;
    width: 48px;
    height: 48px;
    font-size: 48px;
    line-height: 1;
    text-align: center;
    left: 50%;
    top: 50%;
    margin-left: -24px;
    margin-top: -24px;
    color: #c5c7c9;
  }
`;

const Title = styled(CanvasReportHeader)`
  h5 {
    font-family: ${Styles.font.family.segoe.semibold};
    text-align: center;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${Styles.color.muted};
`;

const CanvasReportChart = ({
  title,
  subtitle,
  icon,
  children,
}) => (
  <Fragment>
    <Title tag="h5">{title}</Title>
    <Subtitle>{subtitle}</Subtitle>
    <ChartWrapper>
      {icon && <Icon name={icon} />}
      {children}
    </ChartWrapper>
  </Fragment>
);

CanvasReportChart.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.string,
};

export default CanvasReportChart;
