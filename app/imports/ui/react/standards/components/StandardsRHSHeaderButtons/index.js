import React from 'react';

import propTypes from './propTypes';
import ToggleExpandButton from '../../../components/Buttons/ToggleExpandButton';
import DiscussButton from '../../../components/Buttons/DiscussButton';
import EditButton from '../../../components/Buttons/EditButton';
import Button from '../../../components/Buttons/Button';

const StandardsRHSHeaderButtons = (props) => {
  const toggleExpandButton = props.hasDocxAttachment ? (
    <ToggleExpandButton onClick={props.onToggleScreenMode} />
  ) : null;

  const discussionButton = !props.isDiscussionOpened ? (
    <DiscussButton
      onClick={props.onDiscussionOpen}
      href={props.pathToDiscussion}
      unreadMessagesCount={props.unreadMessagesCount}
    >
      {props.names.discuss}
    </DiscussButton>
  ) : null;

  const restoreButton = props.hasAccess && props.isDeleted ? (
    <Button type="secondary" onClick={props.onRestore}>
      {props.names.restore}
    </Button>
  ) : null;

  const deleteButton = (
    props.hasAccess &&
    props.isDeleted &&
    props.hasFullAccess ? (
      <Button type="primary" onClick={props.onDelete}>
        {props.names.delete}
      </Button>
    ) : null
  );

  const editButton = !props.isDeleted ? (
    <EditButton onClick={props.onModalOpen} >
      {props.names.edit}
    </EditButton>
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
