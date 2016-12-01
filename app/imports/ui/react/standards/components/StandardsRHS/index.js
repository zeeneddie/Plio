import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';
import RHS from '../../../components/RHS';
import HeaderButtons from './HeaderButtons';
import ContentList from './ContentList';
import Body from './Body';
import NotFound from './NotFound';

const StandardsRHS = (props) => (
  <RHS
    className={cx('expandable', {
      expanded: props.isFullScreenMode,
      content: !props.standard,
    })}
  >
    <RHS.Card className="standard-details">
      <RHS.Header
        title={props.names.headerNames.header}
        isReady={props.isReady}
      >
        {props.isReady && (
          <HeaderButtons
            isDiscussionOpened={props.isDiscussionOpened}
            names={props.names.headerNames}
            isDeleted={props.standard.isDeleted}
            unreadMessagesCount={props.standard.unreadMessagesCount}
            pathToDiscussion={props.pathToDiscussion}
            hasDocxAttachment={props.hasDocxAttachment}
            hasAccess={props.hasAccess}
            hasFullAccess={props.hasFullAccess}
            onToggleScreenMode={props.onToggleScreenMode}
            onModalOpen={props.onModalOpen}
            onDiscussionOpen={props.onDiscussionOpen}
            onRestore={props.onRestore}
            onDelete={props.onDelete}
          />
        )}
      </RHS.Header>

      <ContentList
        isReady={props.isReady}
        standard={props.standard}
        hasDocxAttachment={props.hasDocxAttachment}
        files={props.files}
        orgSerialNumber={props.orgSerialNumber}
        ncs={props.ncs}
        risks={props.risks}
        actions={props.actions}
        workItems={props.workItems}
        lessons={props.lessons}
      />
    </RHS.Card>
  </RHS>
);

StandardsRHS.propTypes = propTypes;

StandardsRHS.HeaderButtons = HeaderButtons;
StandardsRHS.ContentList = ContentList;
StandardsRHS.Body = Body;
StandardsRHS.NotFound = NotFound;

export default StandardsRHS;
