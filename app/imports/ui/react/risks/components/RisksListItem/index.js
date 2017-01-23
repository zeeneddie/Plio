import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';
import ListItemLink from '../../../components/ListItemLink';
import ListItem from '../../../components/ListItem';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';
import Label from '../../../components/Labels/Label';
import { getClassByScore } from '/imports/api/risks/helpers';

const RiskListItem = ({
  isActive,
  title,
  sequentialId,
  status,
  isDeleted,
  deletedByText,
  deletedAtText,
  unreadMessagesCount,
  isNew,
  primaryScore = {},
  ...other
}) => (
  <ListItemLink
    {...{ isActive, ...other }}
  >
    <Label className={cx('risk-square', `impact-${getClassByScore(primaryScore.value)}`)}>
      {primaryScore.value}
    </Label>
    <ListItem>
      <div className="flexbox-row">
        <ListItem.Heading>
          <span className="margin-right">{title}</span>

          {isNew && (
            <Label names="primary">New</Label>
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
        {sequentialId}
      </ListItem.LeftText>
      {isDeleted && (
        <ListItem.RightText>
          {deletedAtText}
        </ListItem.RightText>
      )}
    </ListItem>
  </ListItemLink>
);

RiskListItem.propTypes = propTypes;

export default RiskListItem;
