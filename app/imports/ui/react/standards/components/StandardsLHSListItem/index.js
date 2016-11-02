import React from 'react';

import ListItemLink from '../../../components/ListItemLink';

const StandardsLHSListItem = (props) => (
  <ListItemLink
    isActive={props.isActive}
    onClick={props.onClick}
    href={props.href}>
    <div className={props.className}>
      <div className="list-group-item-content">
        <h4 className="list-group-item-heading pull-xs-left">
          <span>{props.title}</span>

          {props.isNew && (
            <span className="label label-primary">New</span>
          )}

          {props.status === 'draft' && (
            <span className="label label-danger">
              {`Issue ${props.issueNumber} Draft`}
            </span>
          )}
        </h4>
        {props.isDeleted && (
          <p className="list-group-item-text pull-right">
            {`Deleted by ${props.deletedByText}`}
          </p>
        )}
        {props.unreadMessagesCount && (
          <p className="list-group-item-text pull-right text-danger">
            <i className="fa fa-comments"></i>
            {props.unreadMessagesCount}
          </p>
        )}
        <p className="list-group-item-text pull-left">
          {props.type.title}
        </p>
        {props.isDeleted && (
          <p className="list-group-item-text pull-right">
            {props.deletedAtText}
          </p>
        )}
      </div>
    </div>
  </ListItemLink>
);

export default StandardsLHSListItem;
