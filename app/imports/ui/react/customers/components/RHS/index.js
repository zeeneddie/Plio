import React, { PropTypes } from 'react';
import cx from 'classnames';

import RHS from '../../../components/RHS';
// import HeaderButtons from './HeaderButtons';
// import ContentList from './ContentList';
// import Body from './Body';
// import NotFound from './NotFound';
// import NotExist from './NotExist';
// import RHSHeaderButtonsContainer from '../../containers/RHSHeaderButtonsContainer';

const CustomersRHS = ({
  organization,
  isReady = true,
}) => (
  <RHS
    className={cx('expandable', { content: !organization })}
  >
    <RHS.Card className="organization-details">
      <RHS.Header
        title="Compliance Standard"
        isReady={isReady}
      >
        {/* <RHSHeaderButtonsContainer {...{ organization, hasDocxAttachment }} /> */}
      </RHS.Header>

      {/* <ContentList {...{ isReady, organization, hasDocxAttachment }} /> */}
    </RHS.Card>
  </RHS>
);

CustomersRHS.propTypes = {
  isReady: PropTypes.bool,
  organization: PropTypes.object,
};

// CustomersRHS.HeaderButtons = HeaderButtons;
// CustomersRHS.ContentList = ContentList;
// CustomersRHS.Body = Body;
// CustomersRHS.NotFound = NotFound;
// CustomersRHS.NotExist = NotExist;

export default CustomersRHS;
