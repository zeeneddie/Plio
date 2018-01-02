import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'ramda';
import pluralize from 'pluralize';

import { DashboardStats, Button, Icon, IconLoading } from '../../components';
import { DashboardStatsMessageContainer } from '../containers';

const DashboardStatsUnreadMessages = ({
  messages,
  count,
  markAllAsRead,
  hasItemsToLoad,
  loadAll,
  loadLimited,
  hiddenCount,
  loading,
  orgSerialNumber,
}) => !!messages.length && (
  <DashboardStats>
    <DashboardStats.Title>
      {pluralize('unread message', count || messages.length, true)}
      <a className="pointer" title="Mark all messages as read" onClick={markAllAsRead}>
        <Icon name="times-circle" />
      </a>
    </DashboardStats.Title>
    {map(message => (
      <DashboardStatsMessageContainer
        key={message._id}
        {...{ ...message, orgSerialNumber }}
      />
    ), messages)}
    {hasItemsToLoad ? (
      <Button color="secondary" onClick={loadAll}>
        View all items
        {loading ? (
          <IconLoading />
        ) : (
          <span>({hiddenCount} more)</span>
        )}
      </Button>
    ) : (
      <Button color="secondary" onClick={loadLimited}>
        <span>Hide</span>
        {loading ? (
          <IconLoading />
        ) : (
          <span>({hiddenCount} items)</span>
        )}
      </Button>
    )}
  </DashboardStats>
);

DashboardStatsUnreadMessages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  count: PropTypes.number.isRequired,
  markAllAsRead: PropTypes.func.isRequired,
  hasItemsToLoad: PropTypes.bool,
  loadAll: PropTypes.func.isRequired,
  loadLimited: PropTypes.func.isRequired,
  hiddenCount: PropTypes.number,
  loading: PropTypes.bool,
  orgSerialNumber: PropTypes.number.isRequired,
};

export default DashboardStatsUnreadMessages;
