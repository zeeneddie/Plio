import PropTypes from 'prop-types';
import React from 'react';

import ToggleExpandButton from '../../../../components/Buttons/ToggleExpandButton';
import DiscussButton from '../../../../components/Buttons/DiscussButton';
import Button from '../../../../components/Buttons/Button';
import StandardEditRHSButton from '../../StandardEditRHSButton';

const HeaderButtons = (props) => {
  const toggleExpandButton = props.hasDocxAttachment && (
    <ToggleExpandButton onClick={props.onToggleScreenMode} />
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
    <StandardEditRHSButton
      standardId={props._id}
      organizationId={props.organizationId}
    />
  );

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
  _id: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
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
