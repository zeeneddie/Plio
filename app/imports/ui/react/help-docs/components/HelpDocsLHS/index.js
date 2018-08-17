import React from 'react';

import LHSContainer from '../../../containers/LHSContainer';
import HelpDocsLHSSectionList from '../HelpDocsLHSSectionList';
import propTypes from './propTypes';

const HelpDocsLHS = props => (
  <LHSContainer
    animating={props.animating}
    searchText={props.searchText}
    searchResultsText={props.searchResultsText}
    onChange={props.onSearchTextChange}
    onClear={props.onClear}
    onModalButtonClick={props.onModalOpen}
  >
    <HelpDocsLHSSectionList
      sections={props.sections}
      collapsed={props.collapsed}
      onToggleCollapse={props.onToggleCollapse}
      userHasChangeAccess={props.userHasChangeAccess}
    />
  </LHSContainer>
);

HelpDocsLHS.propTypes = propTypes;

export default HelpDocsLHS;
