import React from 'react';

import propTypes from './propTypes';
import ListItemLink from '../../../components/ListItemLink';
import ListItem from '../../../components/ListItem';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';
import Label from '../../../components/Labels/Label';
import LabelDraft from '../../../components/Labels/LabelDraft';

const StandardListItem = ({
  isActive,
  onClick,
  href,
  className,
  title,
  status,
  issueNumber,
  uniqueNumber,
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
            <Label names="primary">New</Label>
          )}

          {status === 'draft' && !!issueNumber && (
            <LabelDraft issueNumber={issueNumber} />
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
              <LabelMessagesCount count={unreadMessagesCount} />
            </ListItem.RightText>
          )}
        </div>
      </div>
      <ListItem.LeftText>
        {type.abbreviation && type.abbreviation + (uniqueNumber || '')}
      </ListItem.LeftText>
      {isDeleted && (
        <ListItem.RightText>
          {deletedAtText}
        </ListItem.RightText>
      )}
    </ListItem>
  </ListItemLink>
);

StandardListItem.propTypes = propTypes;

export default StandardListItem;
