import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { getPath } from '../../../../../ui/utils/router/paths';
import {
  onModalOpen,
  onRestore,
  onDelete,
} from './handlers';
import HeaderButtons from '../../components/RHS/HeaderButtons';
import {
  getIsFullScreenMode,
  getUserId,
} from '../../../../store/selectors/global';
import { getOrganizationId } from '../../../../store/selectors/organizations';
import { getIsDiscussionOpened } from '../../../../store/selectors/discussion';
import {
  getCanChangeStandards,
  getIsOrgOwner,
} from '../../../../store/selectors/users';

const mapStateToProps = (state, { risk: { _id, title, isDeleted = false } }) => ({
  _id,
  title,
  isDeleted,
  pathToDiscussion: getPath('riskDiscussion')({ urlItemId: _id }),
  userId: getUserId(state),
  isFullScreenMode: getIsFullScreenMode(state),
  organizationId: getOrganizationId(state),
  isDiscussionOpened: getIsDiscussionOpened(state),
  hasAccess: getCanChangeStandards(state),
  hasFullAccess: getIsOrgOwner(state),
});

export default compose(
  connect(mapStateToProps),
  withHandlers({
    onModalOpen,
    onRestore,
    onDelete,
  }),
)(HeaderButtons);
