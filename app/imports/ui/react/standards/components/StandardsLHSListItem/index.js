import React from 'react';

import propTypes from './propTypes';
import ListItemLink from '../../../components/ListItemLink';
import ListItem from '../../../components/ListItem';
import MessagesCount from '../../../components/MessagesCount';

const StandardsLHSListItem = ({
  isActive,
  onClick,
  href,
  className,
  title,
  issueNumber,
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
          <span className="label label-primary">New</span>
        )}

        {status === 'draft' && (
          <span className="label label-danger">
            {`Issue ${issueNumber} Draft`}
          </span>
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
