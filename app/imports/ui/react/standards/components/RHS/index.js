import React, { PropTypes } from 'react';
import cx from 'classnames';

import RHS from '../../../components/RHS';
import HeaderButtons from './HeaderButtons';
import ContentList from './ContentList';
import Body from './Body';
import NotFound from './NotFound';
import NotExist from './NotExist';
import RHSHeaderButtonsContainer from '../../containers/RHSHeaderButtonsContainer';

const StandardsRHS = ({
  isFullScreenMode,
  standard,
  isReady = true,
  hasDocxAttachment,
}) => (
  <RHS
    className={cx('expandable', {
      expanded: isFullScreenMode,
      content: !standard,
    })}
  >
    <RHS.Card className="standard-details">
      <RHS.Header
        title="Compliance Standard"
        isReady={isReady}
      >
        <RHSHeaderButtonsContainer {...{ standard, hasDocxAttachment }} />
      </RHS.Header>

      <ContentList {...{ isReady, standard, hasDocxAttachment }} />
    </RHS.Card>
  </RHS>
);

StandardsRHS.propTypes = {
  hasDocxAttachment: PropTypes.bool,
  isFullScreenMode: PropTypes.bool,
  standard: PropTypes.object,
  isReady: PropTypes.bool,
};

StandardsRHS.HeaderButtons = HeaderButtons;
StandardsRHS.ContentList = ContentList;
StandardsRHS.Body = Body;
StandardsRHS.NotFound = NotFound;
StandardsRHS.NotExist = NotExist;

export default StandardsRHS;
