import {
  compose,
  withHandlers,
  mapProps,
  branch,
  renderComponent,
  shouldUpdate,
} from 'recompose';
import { connect } from 'react-redux';
import { _ } from 'meteor/underscore';

import {
  propEq,
  some,
  getC,
  propEqId,
  every,
  lengthStandards,
  notEquals,
  omitC,
  compareByProps,
} from '/imports/api/helpers';
import { canChangeStandards, isOrgOwner } from '/imports/api/checkers';
import StandardsRHS from '../../components/RHS';
import {
  onToggleScreenMode,
  onDiscussionOpen,
  onModalOpen,
  onRestore,
  onDelete,
} from './handlers';
import { getPathToDiscussion, getStandardsByFilter } from '../../helpers';
import { ProblemTypes, DocumentTypes } from '/imports/share/constants';

const mapStateToProps = ({
  standards: { isFullScreenMode, isCardReady },
  global: { urlItemId, filter, userId },
  organizations: { organizationId, orgSerialNumber },
  discussion: { isDiscussionOpened },
  collections: {
    standards,
    standardsByIds,
    standardBookSectionsByIds,
    standardTypesByIds,
    files,
    filesByIds,
    ncs,
    risks,
    actions,
    workItems,
    lessons,
  },
}) => ({
  isDiscussionOpened,
  organizationId,
  orgSerialNumber,
  userId,
  isFullScreenMode,
  files,
  filesByIds,
  ncs,
  risks,
  actions,
  workItems,
  lessons,
  standards,
  urlItemId,
  filter,
  standardsByIds,
  standardBookSectionsByIds,
  standardTypesByIds,
  isCardReady,
});

// TODO: optimize rhs
export default compose(
  connect(mapStateToProps),
  mapProps(({
    standardsByIds,
    standardBookSectionsByIds,
    standardTypesByIds,
    isCardReady,
    ...props,
  }) => {
    const standard = standardsByIds[props.urlItemId];
    return {
      ...props,
      standards: getStandardsByFilter(props),
      standard: {
        ...standard,
        section: standardBookSectionsByIds[getC('sectionId', standard)],
        type: standardTypesByIds[getC('typeId', standard)],
      },
      isReady: !!(isCardReady && props.standards.length && standard),
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
  branch(
    lengthStandards,
    _.identity,
    renderComponent(StandardsRHS.NotFound),
  ),
  branch(
    props => props.isReady,
    _.identity,
    renderComponent(StandardsRHS),
  ),
  shouldUpdate((props, nextProps) => {
    const omitStandardKeys = omitC(['updatedAt']);
    const compareBySeqId = compareByProps(['title', 'serialNumber']);
    return !!nextProps.standard && !!(
      props.userId !== nextProps.userId ||
      props.organizationId !== nextProps.organizationId ||
      props.isFullScreenMode !== nextProps.isFullScreenMode ||
      notEquals(omitStandardKeys(props.standard), omitStandardKeys(nextProps.standard)) ||
      compareBySeqId(props.ncs, nextProps.ncs) ||
      compareBySeqId(props.risks, nextProps.risks) ||
      compareBySeqId(props.actions, nextProps.actions) ||
      compareBySeqId(props.lessons, nextProps.lessons) ||
      props.files.length !== nextProps.files.length
    );
  }),
  mapProps((props) => {
    let standard = { ...props.standard };
    const hasDocxAttachment = some([getC('source1.htmlUrl'), getC('source2.htmlUrl')], standard);
    const hasAccess = canChangeStandards(props.userId, props.organizationId);
    const hasFullAccess = isOrgOwner(props.userId, props.organizationId);
    const pathToDiscussion = getPathToDiscussion(props);
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
    const source1 = standard.source1 && {
      ...standard.source1,
      file: props.filesByIds[getFileId(standard.source1)],
    };
    const source2 = standard.source2 && {
      ...standard.source2,
      file: props.filesByIds[getFileId(standard.source2)],
    };

    standard = { ...props.standard, source1, source2 };

    return {
      ...props,
      files,
      ncs,
      risks,
      actions,
      lessons,
      standard,
      hasDocxAttachment,
      hasAccess,
      hasFullAccess,
      pathToDiscussion,
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
