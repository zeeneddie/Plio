import React from 'react';
import cx from 'classnames';

import StandardsRHSHeader from '../StandardsRHSHeader';
import Collapse from '../../../components/Collapse';
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

      <div className="content-list">
        <Collapse
          collapsed={props.collapsed}
          onToggleCollapse={props.onToggleCollapse}
        >
          <h4 className="list-group-item-heading pull-left">
            <span>{props.standard.title}</span>
            {props.standard.status === 'draft' && (
              <span className="label label-danger">
                <span>{`Issue ${props.standard.issueNumber}`}</span>
                <span>Draft</span>
              </span>
            )}
          </h4>
          {'Hello world'.repeat(200)}
        </Collapse>
      </div>
    </div>
  </div>
);

StandardsRHS.propTypes = propTypes;

export default StandardsRHS;
