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
import {
  getCanChangeStandards,
  getIsOrgOwner,
} from '../../../../../client/store/selectors/users';

const mapStateToProps = (state, { standard: { _id, title, isDeleted = false } }) => ({
  _id,
  title,
  isDeleted,
  userId: getUserId(state),
  organizationId: getOrganizationId(state),
  hasAccess: getCanChangeStandards(state),
  hasFullAccess: getIsOrgOwner(state),
  isFullScreenMode: getIsFullScreenMode(state),
  isDiscussionOpened: getIsDiscussionOpened(state),
  pathToDiscussion: getPath('standardDiscussion')({ urlItemId: _id }),
});

export default compose(
  connect(mapStateToProps),
  withHandlers({
    onToggleScreenMode,
    onModalOpen,
    onRestore,
    onDelete,
  }),
)(HeaderButtons);
