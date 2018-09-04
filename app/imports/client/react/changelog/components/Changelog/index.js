import React from 'react';

import CollapseBlock from '../../../components/CollapseBlock';
import ChangelogHeaderContainer from '../../containers/ChangelogHeaderContainer';
import ChangelogContentContainer from '../../containers/ChangelogContentContainer';
import ChangelogFooterContainer from '../../containers/ChangelogFooterContainer';
import propTypes from './propTypes';

const Changelog = props => (
  <CollapseBlock
    classNames={{ head: '', body: 'card-changelog collapse' }}
    collapsed={props.isChangelogCollapsed}
    onToggleCollapse={props.onToggleCollapse}
  >
    <ChangelogHeaderContainer
      documentId={props.documentId}
      collection={props.collection}
    />
    <div>
      <ChangelogContentContainer
        documentId={props.documentId}
        collection={props.collection}
      />
      <ChangelogFooterContainer
        documentId={props.documentId}
        collection={props.collection}
        onViewAllClick={props.onViewAllClick}
      />
    </div>
  </CollapseBlock>
);

Changelog.propTypes = propTypes;

export default Changelog;
