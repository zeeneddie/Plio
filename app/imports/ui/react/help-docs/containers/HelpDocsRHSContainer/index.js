import { branch, compose, mapProps, renderComponent, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { _ } from 'meteor/underscore';

import { pickC, pickDeep, propEqId } from '/imports/api/helpers';
import { canChangeHelpDocs } from '/imports/api/checkers';
import { onToggleScreenMode } from '../../../standards/containers/StandardsRHSContainer/handlers'; // FIXME
import { onModalOpen } from './handlers';
import HelpDocsRHS from '../../components/HelpDocsRHS';
import HelpDocsRHSNotFound from '../../components/HelpDocsRHSNotFound';

export default compose(
  connect(pickDeep([
    'collections.helpDocs',
    'global.userId',
  ])),

  withProps(props => ({
    userHasChangeAccess: canChangeHelpDocs(props.userId),
  })),

  branch(
    ({ helpDocs }) => !!helpDocs.length,
    _.identity,
    renderComponent(HelpDocsRHSNotFound),
  ),

  connect(pickDeep([
    'collections.helpSections',
    'collections.files',
    'global.isCardReady',
    'global.isFullScreenMode',
    'global.urlItemId',
  ])),

  withProps((props) => {
    const helpDoc = { ...props.helpDocs.find(propEqId(props.urlItemId)) };
    const helpDocSection = { ...props.helpSections.find(propEqId(helpDoc.sectionId)) };

    let hasDocxAttachment = false;
    let file;
    if (helpDoc.source && helpDoc.source.fileId) {
      file = props.files.find(propEqId(helpDoc.source.fileId));
      hasDocxAttachment = !!helpDoc.source.htmlUrl;
    }

    return {
      ...props,
      helpDoc,
      helpDocSection,
      file,
      hasDocxAttachment,
      headerTitle: 'Help card',
    };
  }),

  withHandlers({
    onToggleScreenMode,
    onModalOpen,
  }),

  mapProps(props => pickC([
    'dispatch',
    'headerTitle',
    'isCardReady',
    'isFullScreenMode',
    'hasDocxAttachment',
    'onToggleScreenMode',
    'onModalOpen',
    'helpDoc',
    'helpDocSection',
    'file',
    'userHasChangeAccess',
  ])(props)),
)(HelpDocsRHS);
