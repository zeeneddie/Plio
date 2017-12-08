import React from 'react';

import ListItemLink from '../../../components/ListItemLink';
import ListItem from '../../../components/ListItem';
import LabelDraft from '../../../components/Labels/LabelDraft';
import propTypes from './propTypes';

const HelpDocsLHSListItem = props => (
  <ListItemLink
    isActive={props.isActive}
    onClick={props.onClick}
    href={props.href}
  >
    <ListItem>
      <ListItem.Heading>
        <span className="margin-right">{props.title}</span>

        {(props.status === 'draft' && props.issueNumber && props.userHasChangeAccess) ? (
          <LabelDraft issueNumber={props.issueNumber} />
        ) : ''}
      </ListItem.Heading>
    </ListItem>
  </ListItemLink>
);

HelpDocsLHSListItem.propTypes = propTypes;

export default HelpDocsLHSListItem;
