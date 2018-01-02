import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'ramda';
import pluralize from 'pluralize';

import { DashboardStats, Button, Icon, IconLoading } from '../../components';

export const DashboardUserStats = ({
  messages,
  count,
  markAllAsRead,
  hasItemsToLoad,
  loadAll,
  loadLimited,
  hiddenUnreadMessagesNumber,
  loading,
}) => !!messages.length && (
  <DashboardStats>
    <DashboardStats.Title>
      {pluralize('unread message', count || messages.length, true)}
      <a className="pointer" title="Mark all messages as read" onClick={markAllAsRead}>
        <Icon name="times-circle" />
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
        {loading ? (
          <IconLoading />
        ) : (
          <span>({hiddenUnreadMessagesNumber} more)</span>
        )}
      </Button>
    ) : (
      <Button color="secondary" onClick={loadLimited}>
        <span>Hide</span>
        {loading ? (
          <IconLoading />
        ) : (
          <span>({hiddenUnreadMessagesNumber} items)</span>
        )}
      </Button>
    )}
  </DashboardStats>
);

DashboardUserStats.propTypes = {

};

export default DashboardUserStats;
