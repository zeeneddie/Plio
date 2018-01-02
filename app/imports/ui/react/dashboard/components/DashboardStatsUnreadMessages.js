import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'ramda';

import { DashboardStats, Button, Icon, IconLoading } from '../../components';

export const DashboardUserStats = ({
  messages,
  count,
  markAllAsRead,
  hasItemsToLoad,
  loadAll,
  isReady,
  hiddenUnreadMessagesNumber,
  enableLimit,
}) => !!messages.length && (
  <DashboardStats>
    <DashboardStats.Title>
      {count}
      <a className="pointer" onClick={markAllAsRead}>
        <Icon name="times-circle" title="Mark all messages as read" />
      </a>
    </DashboardStats.Title>
    {map(({
      _id,
      url,
      extension,
      fullName,
      text,
      timeString,
    }) => (
      <a
        key={_id}
        className="dashboard-stats-message"
        href={url}
      >
        {extension ? (
          <Icon name={`file-${extension}-o`} />
        ) : (
          <Icon name="comment" />
        )}
        <strong>{fullName}: </strong>
        {text}
        <span className="text-muted">{timeString} ago</span>
      </a>
    ), messages)}
    {hasItemsToLoad ? (
      <Button color="secondary" onClick={loadAll}>
        View all items
        {isReady ? (
          <span>({hiddenUnreadMessagesNumber} more)</span>
        ) : (
          <IconLoading margin="bottom" />
        )}
      </Button>
    ) : enableLimit && (
      <Button color="secondary" onClick={() => enableLimit(true)}>
        <span>Hide</span>
        {isReady ? (
          <span>({hiddenUnreadMessagesNumber} items)</span>
        ) : (
          <IconLoading margin="bottom" />
        )}
      </Button>
    )}
  </DashboardStats>
);

DashboardUserStats.propTypes = {

};

export default DashboardUserStats;
