import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Styles } from '../../../../api/constants';

const Header = styled.div`
  h1, h2, h3, h4 {
    font-family: ${Styles.font.family.segoe.semibold};
    margin-bottom: 1rem;
    overflow: hidden;
  }
  h5, h6 {
    font-family: ${Styles.font.family.segoe.regular};
  }
  h3, h6 {
    color: ${Styles.color.muted};
    text-transform: uppercase;
  }
  h3 {
    letter-spacing: 1px;
    font-size: 16px;
  }
  h4 {
    font-size: 18px;
    line-height: 1.2;
  }
  h5 {
    font-size: 20px;
  }
  h6 {
    letter-spacing: 1.4px;
    line-height: 21px;
    margin: 0;
  }
  span {
    color: ${Styles.color.muted};
    font-family: ${Styles.font.family.segoe.regular};
    font-size: 1rem;
    margin-left: 5px;
    text-transform: none;
  }
`;

const CanvasReportHeader = ({
  children,
  isEmpty,
  tag: Tag = 'h4',
  ...rest
}) => (
  <Header {...rest}>
    <Tag>
      {children}
      {isEmpty && <span>(none)</span>}
    </Tag>
  </Header>
);

CanvasReportHeader.propTypes = {
  children: PropTypes.node.isRequired,
  tag: PropTypes.string,
  isEmpty: PropTypes.bool,
};

export default CanvasReportHeader;
