import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'ramda';
import pluralize from 'pluralize';
import { onlyUpdateForKeys } from 'recompose';
import { joinIds } from 'plio-util';

import { Icon, IconLoading, DashboardStatsExpandable } from '../../components';
import DashboardStatsMessageContainer from '../containers/DashboardStatsMessageContainer';
import {
  WorkspaceDefaults,
  WorkspaceDefaultsTypes,
} from '../../../../share/constants';

const enhance = onlyUpdateForKeys([
  'messages',
  'count',
  'loading',
  'orgSerialNumber',
  'displayMessages',
  'isOpen',
]);

export const DashboardStatsUnreadMessages = ({
  messages,
  count,
  markAllAsRead,
  loading,
  orgSerialNumber,
  displayMessages = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_MESSAGES],
  isOpen,
  toggle,
}) => (
  <DashboardStatsExpandable
    total={count}
    items={messages}
    itemsPerRow={displayMessages}
    renderIcon={loading ? () => <IconLoading /> : undefined}
    render={({ items }) => (
      <div key={joinIds(items)}>
        {map(message => (
          <DashboardStatsMessageContainer
            key={message._id}
            {...{ ...message, orgSerialNumber }}
          />
        ), items)}
      </div>
    )}
    {...{ isOpen, toggle }}
  >
    {pluralize('unread message', count || messages.length, true)}
    <a className="pointer" title="Mark all messages as read" onClick={markAllAsRead}>
      <Icon name="times-circle" />
    </a>
  </DashboardStatsExpandable>
);

DashboardStatsUnreadMessages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  count: PropTypes.number.isRequired,
  markAllAsRead: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  orgSerialNumber: PropTypes.number.isRequired,
  isLimitEnabled: PropTypes.bool,
  displayMessages: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default enhance(DashboardStatsUnreadMessages);
