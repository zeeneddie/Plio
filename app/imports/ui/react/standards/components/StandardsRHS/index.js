import React from 'react';
import cx from 'classnames';

import StandardsRHSHeader from '../StandardsRHSHeader';
import PreloaderPage from '../../../components/PreloaderPage';
import StandardsRHSBodyContainer from '../../containers/StandardsRHSBodyContainer';
import propTypes from './propTypes';

const StandardsRHS = (props) => (
  <div
    className={cx(
      'content-cards-inner flex expandable',
      {
        expanded: props.isFullScreenMode,
        content: !props.standard,
      }
    )}
  >
    <div className="card standard-details">
      <StandardsRHSHeader
        isReady={props.isCardReady}
        names={props.names.headerNames}
        isDeleted={props.standard.isDeleted}
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

      {props.isCardReady ? (
        <StandardsRHSBodyContainer
          standard={props.standard}
          collapsed={props.hasDocxAttachment}
          files={props.files}
          orgSerialNumber={props.orgSerialNumber}
          ncs={props.ncs}
          risks={props.risks}
          actions={props.actions}
        />
      ) : (
        <PreloaderPage />
      )}
    </div>
  </div>
);

StandardsRHS.propTypes = propTypes;

export default StandardsRHS;
