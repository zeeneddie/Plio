import PropTypes from 'prop-types';
import React from 'react';

import ToggleExpandButton from '../../../../components/Buttons/ToggleExpandButton';
import DiscussButton from '../../../../components/Buttons/DiscussButton';
import Button from '../../../../components/Buttons/Button';
import StandardMarkAsReadModalContainer from '../../../containers/StandardMarkAsReadModalContainer';
import useToggle from '../../../../hooks/useToggle';

const HeaderButtons = (props) => {
  const [isOpen, toggle] = useToggle(false);

  const toggleExpandButton = props.hasDocxAttachment && (
    <ToggleExpandButton onClick={props.onToggleScreenMode} />
  );

  // TODO: don't render if already marked
  const markAsReadButton = !props.isDeleted && (
    <Button color="success" onClick={toggle}>Mark as read</Button>
  );

  const discussionButton = !props.isDiscussionOpened && (
    <DiscussButton
      onClick={props.onDiscussionOpen}
      href={props.pathToDiscussion}
      unreadMessagesCount={props.unreadMessagesCount}
    >
      Discuss
    </DiscussButton>
  );

  const restoreButton = props.hasAccess && props.isDeleted && (
    <Button color="secondary" onClick={props.onRestore}>
      Restore
    </Button>
  );

  const deleteButton = (
    props.hasAccess &&
    props.isDeleted &&
    props.hasFullAccess && (
      <Button color="primary" onClick={props.onDelete}>
        Delete
      </Button>
    )
  );

  const editButton = !props.isDeleted && (
    <Button color="primary" onClick={props.onModalOpen} >
      Edit
    </Button>
  );

  return (
    <div>
      <StandardMarkAsReadModalContainer {...{ isOpen, toggle }} standard={props.standard} />
      {toggleExpandButton}
      {markAsReadButton}
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
  standard: PropTypes.object,
};

export default HeaderButtons;
