import React from 'react';

import propTypes from './propTypes';
import ToggleExpandButton from '../../../components/ToggleExpandButton';
import DiscussButton from '../../../components/DiscussButton';
import EditButton from '../../../components/EditButton';

const StandardsRHSHeaderButtons = (props) => {
  const toggleExpandButton = props.hasDocxAttachment ? (
    <ToggleExpandButton onClick={props.onToggleScreenMode} />
  ) : null;

  const discussionButton = !props.isDiscussionOpened ? (
    <DiscussButton
      onClick={props.onDiscussionOpen}
      href={props.pathToDiscussion}
      title={props.names.discuss}
      unreadMessagesCount={props.unreadMessagesCount}
    />
  ) : null;

  const restoreButton = props.hasAccess && props.isDeleted ? (
    <a className="btn btn-secondary" onClick={props.onRestore}>
      {props.names.restore}
    </a>
  ) : null;

  const deleteButton = props.hasAccess
    && props.isDeleted
    && props.hasFullAccess ? (
      <a className="btn btn-primary" onClick={props.onDelete}>
        {props.names.delete}
      </a>
    ) : null;

  const editButton = !props.isDeleted ? (
    <EditButton
      onClick={props.onModalOpen}
      title={props.names.edit}
    />
  ) : null;

  return (
    <div>
      {toggleExpandButton}
      {discussionButton}
      {restoreButton}
      {deleteButton}
      {editButton}
    </div>
  );
};

StandardsRHSHeaderButtons.propTypes = propTypes;

export default StandardsRHSHeaderButtons;
