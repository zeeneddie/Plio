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
  status,
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
      <div className="flexbox-row">
        <ListItem.Heading>
          <span className="margin-right">{title}</span>

          {isNew && (
            <span className="label label-primary margin-right">New</span>
          )}

          {status === 'draft' && (
            <span className="label label-danger margin-right">
              {`Issue ${issueNumber} Draft`}
            </span>
          )}
        </ListItem.Heading>
        <div className="flex">
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
        </div>
      </div>
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
