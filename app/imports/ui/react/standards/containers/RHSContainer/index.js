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
  pickDeep,
} from '/imports/api/helpers';
import { canChangeStandards, isOrgOwner } from '/imports/api/checkers';
import StandardsRHS from '../../components/RHS';
import { getPathToDiscussion, getStandardsByFilter } from '../../helpers';
import { ProblemTypes, DocumentTypes } from '/imports/share/constants';

const mapStateToProps = state => ({
  ...pickDeep([
    'standards.isFullScreenMode',
    'standards.isCardReady',
    'collections.standards',
    'global.filter',
  ])(state),
  standard: state.collections.standardsByIds[state.global.urlItemId],
});

export default compose(
  connect(mapStateToProps),
  mapProps(({
    isCardReady,
    standard,
    standards,
    filter,
    ...props,
  }) => ({
    ...props,
    standard,
    standards: getStandardsByFilter({ standards, filter }),
    isReady: !!(isCardReady && standards.length && standard),
  })),
  branch(
    lengthStandards,
    _.identity,
    renderComponent(StandardsRHS.NotFound),
  ),
  shouldUpdate((props, nextProps) => {
    const omitStandardKeys = omitC(['updatedAt']);
    return !!(
      props.isReady !== nextProps.isReady ||
      props.isFullScreenMode !== nextProps.isFullScreenMode ||
      notEquals(omitStandardKeys(props.standard), omitStandardKeys(nextProps.standard))
    );
  }),
  mapProps((props) => {
    // let standard = { ...props.standard };
    const hasDocxAttachment = some([
      getC('source1.htmlUrl'),
      getC('source2.htmlUrl'),
    ], props.standard);
    // const hasAccess = canChangeStandards(props.userId, props.organizationId);
    // const hasFullAccess = isOrgOwner(props.userId, props.organizationId);
    // const pathToDiscussion = getPathToDiscussion(props);
    // filter all documents to those linked to the standard and map new values to some of them
    // const files = props.files.filter(({ _id }) =>
    //   props.standards.find(({ source1 = {}, source2 = {} }) =>
    //     Object.is(source1.fileId, _id) || Object.is(source2.fileId, _id)));
    // const pFilter = ({ isDeleted, standardsIds = [] }) =>
    //   !isDeleted && standardsIds.includes(props.standard._id);
    // const ncs = props.ncs.filter(pFilter);
    // const risks = props.risks.filter(pFilter);
    // const actions = props.actions.filter(({ isDeleted, linkedTo = [] }) =>
    //   !isDeleted && linkedTo.find(({ documentId, documentType }) =>
    //     (documentType === ProblemTypes.NON_CONFORMITY || documentType === ProblemTypes.RISK) &&
    //     [...ncs].concat(risks).find(propEqId(documentId))));
    // const lessons = props.lessons.filter(
    //   every([
    //     propEq('documentId', props.standard._id),
    //     propEq('documentType', DocumentTypes.STANDARD),
    //   ]),
    // );
    // const getFileId = getC('fileId');
    // const source1 = standard.source1 && {
    //   ...standard.source1,
    //   file: props.filesByIds[getFileId(standard.source1)],
    // };
    // const source2 = standard.source2 && {
    //   ...standard.source2,
    //   file: props.filesByIds[getFileId(standard.source2)],
    // };
    //
    // standard = { ...props.standard, source1, source2 };

    return {
      ...props,
      hasDocxAttachment,
  //     hasAccess,
  //     hasFullAccess,
  //     pathToDiscussion,
    };
  }),
)(StandardsRHS);
