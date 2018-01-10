import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'ramda';
import pluralize from 'pluralize';
import { onlyUpdateForKeys } from 'recompose';

import { DashboardStats, Button, Icon, IconLoading } from '../../components';
import { DashboardStatsMessageContainer } from '../containers';
import {
  WorkspaceDefaults,
  WorkspaceDefaultsTypes,
} from '../../../../share/constants';

const enhance = onlyUpdateForKeys([
  'messages',
  'count',
  'loading',
  'orgSerialNumber',
  'isLimitEnabled',
  'displayMessages',
]);

export const DashboardStatsUnreadMessages = ({
  messages,
  count,
  markAllAsRead,
  loadAll,
  loadLimited,
  loading,
  orgSerialNumber,
  isLimitEnabled,
  displayMessages = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_MESSAGES],
}) => {
  let button = null;

  if (count > messages.length) {
    button = (
      <Button color="secondary" onClick={loadAll}>
        View all items
        {loading ? (
          <IconLoading />
        ) : (
          <span>({count - displayMessages} more)</span>
        )}
      </Button>
    );
  } else if (!isLimitEnabled) {
    button = (
      <Button color="secondary" onClick={loadLimited}>
        <span>Hide</span>
        {loading ? (
          <IconLoading />
        ) : (
          <span>({count - displayMessages} items)</span>
        )}
      </Button>
    );
  }

  return (
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
      {button}
    </DashboardStats>
  );
};

DashboardStatsUnreadMessages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  count: PropTypes.number.isRequired,
  markAllAsRead: PropTypes.func.isRequired,
  loadAll: PropTypes.func.isRequired,
  loadLimited: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  orgSerialNumber: PropTypes.number.isRequired,
  isLimitEnabled: PropTypes.bool,
};

export default enhance(DashboardStatsUnreadMessages);
