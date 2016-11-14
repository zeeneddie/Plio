import { compose, withProps, withHandlers, mapProps } from 'recompose';
import { connect } from 'react-redux';

import { propEq, some, getC } from '/imports/api/helpers';
import { canChangeStandards, isOrgOwner } from '/imports/api/checkers';
import StandardsRHS from '../../components/StandardsRHS';
import {
  onToggleScreenMode,
  onDiscussionOpen,
  onModalOpen,
  onRestore,
  onDelete,
} from './handlers';
import { getPathToDiscussion } from '../../helpers';

const mapStateToProps = ({
  standards: {
    standards,
    isCardReady,
    isFullScreenMode,
  },
  global: {
    urlItemId,
    userId,
  },
  organizations: { organizationId },
  discussion: { isDiscussionOpened },
  collections: { files },
}) => ({
  standards,
  urlItemId,
  isCardReady,
  isDiscussionOpened,
  organizationId,
  userId,
  isFullScreenMode,
  files,
});

export default compose(
  connect(mapStateToProps),
  withProps(props => {
    const standard = { ...props.standards.find(propEq('_id', props.urlItemId)) };
    const hasDocxAttachment = some([getC('source1.htmlUrl'), getC('source2.htmlUrl')], standard);
    const hasAccess = canChangeStandards(props.userId, props.organizationId);
    const hasFullAccess = isOrgOwner(props.userId, props.organizationId);
    const pathToDiscussion = getPathToDiscussion(props);

    return {
      standard,
      hasDocxAttachment,
      hasAccess,
      hasFullAccess,
      pathToDiscussion,
      names: {
        headerNames: {
          header: 'Compliance Standard',
          discuss: 'Discuss',
          edit: 'Edit',
          restore: 'Restore',
          delete: 'Delete',
        },
      },
    };
  }),
  mapProps(props => {
    const files = props.files.filter(({ _id }) =>
      props.standards.find(({ source1 = {}, source2 = {} }) =>
        Object.is(source1.fileId, _id) || Object.is(source2.fileId, _id)));

    return {
      ...props,
      files,
    };
  }),
  withHandlers({
    onToggleScreenMode,
    onDiscussionOpen,
    onModalOpen,
    onRestore,
    onDelete,
  }),
)(StandardsRHS);
