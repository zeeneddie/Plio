import React, { Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { pure } from 'recompose';

import { Pull } from './Utility';
import Subcard from './Subcard';
import SubcardBody from './SubcardBody';
import SubcardHeader from './SubcardHeader';

const SubcardWrapper = styled.div`
  & > .card-block-collapse-toggle {
    color: #818a91;
    background-color: #f5f5f5;
    padding: .75rem 1.25rem !important;
    text-align: center;
    position: relative;
    cursor: pointer;
    font-size: 14px;
    min-height: auto;
    border-top: 1px solid #e5e5e5;
    &:before {
      content: ''
    }
    &:hover {
      color: #50575c;
      background-color: #eee;
    }
  }
  h5 {
    margin: 0;
  }
`;

const MoreLess = ({ children, badge }) => (
  <SubcardWrapper>
    <Subcard>
      <SubcardHeader>
        {({ isOpen }) => (
          <Fragment>
            {isOpen ? 'Less' : 'More'}
            {!!badge && !isOpen && (
              <Pull right>
                <h5>{badge}</h5>
              </Pull>
            )}
          </Fragment>
        )}
      </SubcardHeader>
      <SubcardBody>
        {children}
      </SubcardBody>
    </Subcard>
  </SubcardWrapper>
);

MoreLess.propTypes = {
  children: PropTypes.node.isRequired,
  badge: PropTypes.number,
};

export default pure(MoreLess);
