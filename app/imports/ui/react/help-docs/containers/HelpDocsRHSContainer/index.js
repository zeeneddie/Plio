import { compose, mapProps, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';

import { pickC, pickDeep, propEqId } from '/imports/api/helpers';
import { canChangeHelpDocs } from '/imports/api/checkers';
import { onToggleScreenMode } from '../../../standards/containers/StandardsRHSContainer/handlers'; // FIXME
import HelpDocsRHS from '../../components/HelpDocsRHS';

export default compose(
  connect(pickDeep([
    'collections.helpDocs',
    'collections.helpSections',
    'collections.files',
    'global.isCardReady',
    'global.isFullScreenMode',
    'global.urlItemId',
    'global.userId',
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

    const userHasChangeAccess = canChangeHelpDocs(props.userId);

    return {
      helpDoc,
      helpDocSection,
      file,
      hasDocxAttachment,
      userHasChangeAccess,
      headerTitle: 'Help card',
    };
  }),

  withHandlers({
    onToggleScreenMode,
    onModalOpen: (props) => () => alert('on modal open'),
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
