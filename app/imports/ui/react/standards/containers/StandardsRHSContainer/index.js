import { compose, withProps, withHandlers, mapProps, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { _ } from 'meteor/underscore';

import { propEq, some, getC, propEqId, every, lengthStandards } from '/imports/api/helpers';
import { canChangeStandards, isOrgOwner } from '/imports/api/checkers';
import StandardsRHS from '../../components/StandardsRHS';
import StandardsRHSNotFound from '../../components/StandardsRHSNotFound';
import {
  onToggleScreenMode,
  onDiscussionOpen,
  onModalOpen,
  onRestore,
  onDelete,
} from './handlers';
import { getPathToDiscussion } from '../../helpers';
import { ProblemTypes, DocumentTypes } from '/imports/share/constants';

const mapStateToProps = ({
  standards: { standards, isCardReady, isFullScreenMode },
  global: { urlItemId, userId, filter },
  organizations: { organizationId, orgSerialNumber },
  discussion: { isDiscussionOpened },
  collections: { files, ncs, risks, actions, workItems, lessons },
}) => ({
  standards,
  urlItemId,
  isCardReady,
  isDiscussionOpened,
  organizationId,
  orgSerialNumber,
  userId,
  isFullScreenMode,
  files,
  ncs,
  risks,
  actions,
  workItems,
  lessons,
  filter,
});

export default compose(
  connect(mapStateToProps),
  branch(
    lengthStandards,
    _.identity,
    renderComponent(StandardsRHSNotFound),
  ),
  withProps(props => {
    const standard = { ...props.standards.find(propEqId(props.urlItemId)) };
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
    // filter all documents to those linked to the standard and map new values to some of them
    const files = props.files.filter(({ _id }) =>
      props.standards.find(({ source1 = {}, source2 = {} }) =>
        Object.is(source1.fileId, _id) || Object.is(source2.fileId, _id)));
    const pFilter = ({ isDeleted, standardsIds = [] }) =>
      !isDeleted && standardsIds.includes(props.standard._id);
    const ncs = props.ncs.filter(pFilter);
    const risks = props.risks.filter(pFilter);
    const actions = props.actions.filter(({ isDeleted, linkedTo = [] }) =>
      !isDeleted && linkedTo.find(({ documentId, documentType }) =>
        (documentType === ProblemTypes.NON_CONFORMITY || documentType === ProblemTypes.RISK) &&
        [...ncs].concat(risks).find(propEqId(documentId))));
    const lessons = props.lessons.filter(
      every([
        propEq('documentId', props.standard._id),
        propEq('documentType', DocumentTypes.STANDARD),
      ]),
    );
    const getFileId = getC('fileId');
    const source1 = props.standard.source1 && {
      ...props.standard.source1,
      file: files.find(propEqId(getFileId(props.standard.source1))),
    };
    const source2 = props.standard.source2 && {
      ...props.standard.source2,
      file: files.find(propEqId(getFileId(props.standard.source2))),
    };
    const standard = { ...props.standard, source1, source2 };
    const isReady = !!(
      props.isCardReady &&
      props.standards.length &&
      props.standard._id
    );

    return {
      ...props,
      files,
      ncs,
      risks,
      actions,
      lessons,
      standard,
      isReady,
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
