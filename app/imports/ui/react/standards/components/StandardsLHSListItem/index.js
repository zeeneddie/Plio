import React from 'react';

import propTypes from './propTypes';
import ListItemLink from '../../../components/ListItemLink';
import ListItem from '../../../components/ListItem';
import MessagesCount from '../../../components/MessagesCount';
import Label from '../../../components/Labels/Label';
import LabelDraft from '../../../components/Labels/LabelDraft';

const StandardsLHSListItem = ({
  isActive,
  onClick,
  href,
  className,
  title,
  issueNumber,
  status,
  isDeleted,
  deletedByText,
  deletedAtText,
  unreadMessagesCount,
  isNew,
  type = {},
}) => (
  <ListItemLink
    className={className}
    isActive={isActive}
    onClick={onClick}
    href={href}
  >
    <ListItem>
      <ListItem.Heading>
        <span>{title}</span>

        {isNew && (
          <Label names="primary">New</Label>
        )}

        {status === 'draft' && (
          <LabelDraft issueNumber={issueNumber} />
        )}
      </ListItem.Heading>

      {isDeleted && (
        <ListItem.RightText>
          {`Deleted by ${deletedByText}`}
        </ListItem.RightText>
      )}

      {!!unreadMessagesCount && !isDeleted && (
        <ListItem.RightText className="text-danger">
          <MessagesCount count={unreadMessagesCount} />
        </ListItem.RightText>
      )}
      <ListItem.LeftText>
        {type.title}
      </ListItem.LeftText>
      {isDeleted && (
        <ListItem.RightText>
          {deletedAtText}
        </ListItem.RightText>
      )}
    </ListItem>
  </ListItemLink>
);

StandardsLHSListItem.propTypes = propTypes;

export default StandardsLHSListItem;
