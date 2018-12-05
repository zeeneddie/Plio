import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Consumer } from './CanvasReportLayout';
import { Styles } from '../../../../api/constants';

const Header = styled.h1`
  font-size: 24px;
  margin: 0 0 30px;
  color: ${Styles.color.muted};
  font-family: ${Styles.font.family.segoe.regular};
  strong, i {
    color: ${Styles.color.black};
  }
`;

const CanvasReportSectionHeading = ({ children, subtitle, ...rest }) => (
  <Consumer>
    {({ organization }) => (
      <Header {...rest}>
        <strong>{organization.name}</strong>
        {' '}
        {children}
      </Header>
    )}
  </Consumer>
);

CanvasReportSectionHeading.propTypes = {
  children: PropTypes.node.isRequired,
  subtitle: PropTypes.string,
};

export default CanvasReportSectionHeading;
