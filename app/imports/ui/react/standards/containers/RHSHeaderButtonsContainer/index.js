import { compose, mapProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { getPath } from '../../../../utils/router/paths';
import {
  onToggleScreenMode,
  onModalOpen,
  onRestore,
  onDelete,
} from './handlers';
import HeaderButtons from '../../components/RHS/HeaderButtons';
import { getIsFullScreenMode, getUserId } from '../../../../../client/store/selectors/global';
import { getOrganizationId } from '../../../../../client/store/selectors/organizations';
import { getIsDiscussionOpened } from '../../../../../client/store/selectors/discussion';
import { canChangeStandards } from '../../../../../api/checkers/roles';
import { isOrgOwner } from '../../../../../api/checkers/membership';

const mapStateToProps = (state) => {
  const userId = getUserId(state);
  const organizationId = getOrganizationId(state);
  const hasAccess = canChangeStandards(userId, organizationId);
  const hasFullAccess = isOrgOwner(userId, organizationId);

  return {
    userId,
    organizationId,
    hasAccess,
    hasFullAccess,
    isFullScreenMode: getIsFullScreenMode(state),
    isDiscussionOpened: getIsDiscussionOpened(state),
  };
};

export default compose(
  connect(mapStateToProps),
  mapProps(({
    standard: { _id, title, isDeleted = false },
    ...props
  }) => {
    const pathToDiscussion = getPath('standardDiscussion')({ urlItemId: _id });

    return {
      ...props,
      _id,
      title,
      isDeleted,
      pathToDiscussion,
    };
  }),
  withHandlers({
    onToggleScreenMode,
    onModalOpen,
    onRestore,
    onDelete,
  }),
)(HeaderButtons);
