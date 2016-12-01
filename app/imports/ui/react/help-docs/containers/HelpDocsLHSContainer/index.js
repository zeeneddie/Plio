import { connect } from 'react-redux';
import { compose, mapProps, withHandlers } from 'recompose';

import { pickDeep } from '/imports/api/helpers';
import {
  onClear,
  onModalOpen,
  onSearchTextChange,
  onToggleCollapse,
} from './handlers';
import { createHelpSectionsData } from '../../helpers';
import HelpDocsLHS from '../../components/HelpDocsLHS';

const HelpDocsLHSContainer = compose(
  connect(pickDeep([
    'global.urlItemId',
    'global.collapsed',
    'global.animating',
  ])),
  withHandlers({
    onClear,
    onModalOpen,
    onSearchTextChange,
    onToggleCollapse,
  }),
  connect(pickDeep([
    'global.searchText',
    'collections.helpDocs',
    'collections.helpSections',
    'helpDocs.helpDocsFiltered',
  ])),
  mapProps((props) => {
    const helpDocs = props.searchText
      ? props.helpDocs.filter(help => props.helpDocsFiltered.includes(help._id))
      : props.helpDocs;

    const helpSectionsData = createHelpSectionsData(props.helpSections, helpDocs);

    return {
      ...props,
      sections: helpSectionsData,
      searchResultsText: props.searchText
        ? `${helpDocs.length} matching results`
        : '',
    };
  })
)(HelpDocsLHS);

export default HelpDocsLHSContainer;
