import { compose, mapProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { getPathToDiscussion } from '../../../helpers/routeHelpers';
import { canChangeStandards, isOrgOwner } from '/imports/api/checkers';
import { pickDeep } from '/imports/api/helpers';
import {
  onToggleScreenMode,
  onDiscussionOpen,
  onModalOpen,
  onRestore,
  onDelete,
} from './handlers';
import HeaderButtons from '../../components/RHS/HeaderButtons';

export default compose(
  connect(pickDeep([
    'global.isFullScreenMode',
    'global.userId',
    'organizations.organizationId',
    'discussion.isDiscussionOpened',
  ])),

  mapProps(({ standard: { _id, title, isDeleted = false }, organizationId, userId, ...props }) => {
    const hasAccess = canChangeStandards(userId, organizationId);
    const hasFullAccess = isOrgOwner(userId, organizationId);
    const pathToDiscussion = getPathToDiscussion({ urlItemId: _id });

    return {
      ...props,
      userId,
      organizationId,
      _id,
      title,
      hasAccess,
      hasFullAccess,
      pathToDiscussion,
      isDeleted,
    };
  }),
  withHandlers({
    onToggleScreenMode,
    onDiscussionOpen,
    onModalOpen,
    onRestore,
    onDelete,
  }),
)(HeaderButtons);
