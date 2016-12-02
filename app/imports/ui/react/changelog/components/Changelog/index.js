import React from 'react';

import Collapse from '../../../components/Collapse';
import ChangelogHeaderContainer from '../../containers/ChangelogHeaderContainer';
import ChangelogContentContainer from '../../containers/ChangelogContentContainer';
import ChangelogFooterContainer from '../../containers/ChangelogFooterContainer';
import propTypes from './propTypes';

const Changelog = (props) => (
  <Collapse
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
  </Collapse>
);

Changelog.propTypes = propTypes;

export default Changelog;
