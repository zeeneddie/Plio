import React from 'react';

import propTypes from './propTypes';
import PreloaderButton from '../../../components/PreloaderButton';
import ToggleExpandButton from '../../../components/ToggleExpandButton';
import DiscussButton from '../../../components/DiscussButton';
import EditButton from '../../../components/EditButton';

const StandardsRHSHeader = (props) => {
  const toggleExpandButton = props.hasDocxAttachment ? (
    <ToggleExpandButton onClick={props.onToggleScreenMode} />
  ) : null;

  const discussionButton = props.isDiscussionOpened ? (
    <DiscussButton
      onClick={props.onDiscussionOpen}
      href={props.pathToDiscussion}
      title={props.names.discuss}
      // TODO: unreadMessagesCount={}
    />
  ) : null;

  const restoreButton = props.hasAccess && props.isDeleted ? (
    <a className="btn btn-secondary" onClick={props.onRestore}>
      {props.names.restore}
    </a>
  ) : null;

  const deleteButton = props.hasAccess
    && props.isDeleted
    && props.hasFullAccess
    ? (
      <a className="btn btn-primary" onClick={props.onDelete}>
        {props.names.delete}
      </a>
    )
    : null;

  const editButton = !props.isDeleted ? (
    <EditButton
      onClick={props.onModalOpen}
      title={props.names.edit}
    />
  ) : null;



  return (
    <div className="card-block card-heading">
      {props.isReady ? (
        <div className="card-heading-buttons pull-xs-right">
          {toggleExpandButton}
          {discussionButton}
          {restoreButton}
          {deleteButton}
          {editButton}
        </div>
      ) : (
        <div className="card-heading-buttons pull-xs-right">
          <PreloaderButton />
        </div>
      )}
      <h3 className="card-title">
        {props.names.header}
      </h3>
    </div>
  );
};

StandardsRHSHeader.propTypes = propTypes;

export default StandardsRHSHeader;
