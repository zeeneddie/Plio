import React, { PropTypes } from 'react';

import ToggleExpandButton from '../../../../components/Buttons/ToggleExpandButton';
import DiscussButton from '../../../../components/Buttons/DiscussButton';
import Button from '../../../../components/Buttons/Button';

const HeaderButtons = (props) => {
  const toggleExpandButton = props.hasDocxAttachment ? (
    <ToggleExpandButton onClick={props.onToggleScreenMode} />
  ) : null;

  const discussionButton = !props.isDiscussionOpened ? (
    <DiscussButton
      onClick={props.onDiscussionOpen}
      href={props.pathToDiscussion}
      unreadMessagesCount={props.unreadMessagesCount}
    >
      Discuss
    </DiscussButton>
  ) : null;

  const restoreButton = props.hasAccess && props.isDeleted ? (
    <Button type="secondary" onClick={props.onRestore}>
      Restore
    </Button>
  ) : null;

  const deleteButton = (
    props.hasAccess &&
    props.isDeleted &&
    props.hasFullAccess ? (
      <Button type="primary" onClick={props.onDelete}>
        Delete
      </Button>
    ) : null
  );

  const editButton = !props.isDeleted ? (
    <Button type="primary" onClick={props.onModalOpen} >
      Edit
    </Button>
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

HeaderButtons.propTypes = {
  hasDocxAttachment: PropTypes.bool,
  isDiscussionOpened: PropTypes.bool,
  isDeleted: PropTypes.bool,
  unreadMessagesCount: PropTypes.number,
  hasAccess: PropTypes.bool,
  hasFullAccess: PropTypes.bool,
  onToggleScreenMode: PropTypes.func,
  pathToDiscussion: PropTypes.string,
  onDiscussionOpen: PropTypes.func,
  onRestore: PropTypes.func,
  onDelete: PropTypes.func,
  onModalOpen: PropTypes.func,
};

export default HeaderButtons;
