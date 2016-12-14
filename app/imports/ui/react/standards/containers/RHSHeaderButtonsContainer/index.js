import { compose, mapProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { getPathToDiscussion } from '../../../helpers/routeHelpers';
import { canChangeStandards, isOrgOwner } from '/imports/api/checkers';
import { pickDeep, getC, getId } from '/imports/api/helpers';
import {
  onToggleScreenMode,
  onDiscussionOpen,
  onModalOpen, // TODO: fix
  onRestore,
  onDelete,
} from './handlers';
import HeaderButtons from '../../components/RHS/HeaderButtons';

export default compose(
  connect(pickDeep([
    'standards.isFullScreenMode',
    'global.userId',
    'organizations.organizationId',
    'discussions.isDiscussionOpened',
  ])),

  mapProps(({ standard, organizationId, userId, ...props }) => {
    const hasAccess = canChangeStandards(userId, organizationId);
    const hasFullAccess = isOrgOwner(userId, organizationId);
    const pathToDiscussion = getPathToDiscussion({ urlItemId: getId(standard) });
    const isDeleted = getC('isDeleted', standard);

    return {
      ...props,
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
