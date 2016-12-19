/* eslint-disable react/jsx-pascal-case */

import React, { PropTypes } from 'react';
import cx from 'classnames';

import RHS from '../../../components/RHS';
import NotFound from './NotFound';
import NotExist from './NotExist';
import Body from './Body';
import ModalHandle from '../../../components/ModalHandle';

const CustomersRHS = ({ isReady, organization }) => (
  <RHS className={cx({ content: !organization })}>
    <RHS.Card className="standard-details">
      <RHS.Header
        title="Organization"
        isReady={isReady}
      >
        <ModalHandle
          title="Organization"
          helpContent={(
            <div>Hello World</div>
          )}
        >
          <div>Hello World</div>
        </ModalHandle>
      </RHS.Header>

      <RHS.ContentList isReady={isReady}>
        <Body {...organization} />
      </RHS.ContentList>
    </RHS.Card>
  </RHS>
);

CustomersRHS.NotFound = NotFound;
CustomersRHS.NotExist = NotExist;
CustomersRHS.Body = Body;

CustomersRHS.propTypes = {
  organization: PropTypes.object,
  isReady: PropTypes.bool,
};

export default CustomersRHS;
