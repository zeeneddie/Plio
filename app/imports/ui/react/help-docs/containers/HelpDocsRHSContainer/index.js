import { branch, compose, mapProps, renderComponent, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { _ } from 'meteor/underscore';

import { pickC, pickDeep, propEqId } from '/imports/api/helpers';
import { canChangeHelpDocs } from '/imports/api/checkers';
import { onModalOpen } from './handlers';
import { getUser } from '/imports/share/helpers';
import HelpDocsRHS from '../../components/HelpDocsRHS';
import HelpDocsRHSNotFound from '../../components/HelpDocsRHSNotFound';
import HelpDocsRHSNoResults from '../../components/HelpDocsRHSNoResults';
import onToggleScreenMode from '../../../handlers/onToggleScreenMode';

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

  connect(pickDeep(['global.searchText', 'helpDocs.helpDocsFiltered'])),

  branch(
    props => props.searchText && !props.helpDocsFiltered.length,
    renderComponent(HelpDocsRHSNoResults),
    _.identity,
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

    const owner = getUser(helpDoc.ownerId);

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
      owner,
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
    'owner',
    'userHasChangeAccess',
  ])(props)),
)(HelpDocsRHS);
