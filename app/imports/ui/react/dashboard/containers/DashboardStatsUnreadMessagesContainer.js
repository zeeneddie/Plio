import PropTypes from 'prop-types';
import { setPropTypes, withState, withHandlers, flattenProp, onlyUpdateForKeys } from 'recompose';
import { Meteor } from 'meteor/meteor';

import DashboardStatsUnreadMessages from '../components/DashboardStatsUnreadMessages';
import { namedCompose } from '../../helpers';
import { composeWithTracker } from '../../../../client/util';
import { MessageSubs } from '../../../../startup/client/subsmanagers';
import { Messages } from '../../../../share/collections';
import { updateViewedByOrganization } from '../../../../api/discussions/methods';
import {
  WorkspaceDefaults,
  WorkspaceDefaultsTypes,
} from '../../../../share/constants';
import Counter from '../../../../api/counter/client';
import { handleMethodResult } from '../../../../api/helpers';

export default namedCompose('DashboardStatsUnreadMessagesContainer')(
  setPropTypes({
    organization: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      serialNumber: PropTypes.number.isRequired,
      workspaceDefaults: PropTypes.shape({
        displayMessages: PropTypes.number,
      }).isRequired,
    }).isRequired,
  }),
  flattenProp('organization'),
  onlyUpdateForKeys(['_id', 'serialNumber', 'workspaceDefaults']),
  withState('isLimitEnabled', 'setIsLimitEnabled', true),
  composeWithTracker(({
    isLimitEnabled,
    _id: organizationId,
    serialNumber: orgSerialNumber,
    workspaceDefaults: {
      displayMessages = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_MESSAGES],
    } = {},
  }, onData) => {
    const limit = isLimitEnabled ? displayMessages : 0;
    const countSub = Meteor.subscribe(
      'messagesNotViewedCountTotal',
      `unread-messages-count-${organizationId}`,
      organizationId,
    );
    const subs = [
      MessageSubs.subscribe('unreadMessages', { organizationId, limit }),
      countSub,
    ];

    if (subs.every(sub => sub.ready())) {
      const query = { organizationId };
      const options = {
        limit,
        sort: { createdAt: -1 },
      };
      const messages = Messages.find(query, options).fetch();
      const count = Counter.get(`unread-messages-count-${organizationId}`);
      const hasItemsToLoad = count > messages.length;
      const hiddenCount = count - displayMessages;
      onData(null, {
        messages,
        count,
        hasItemsToLoad,
        hiddenCount,
        orgSerialNumber,
      });
    }

    return () => countSub.stop();
  }, {
    propsToWatch: ['isLimitEnabled', '_id', 'serialNumber', 'workspaceDefaults'],
  }),
  withHandlers({
    loadAll: ({ setIsLimitEnabled }) => () => setIsLimitEnabled(false),
    loadLimited: ({ setIsLimitEnabled }) => () => setIsLimitEnabled(true),
    markAllAsRead: ({ organization: { _id } }) => () =>
      updateViewedByOrganization.call({ _id }, handleMethodResult()),
  }),
)(DashboardStatsUnreadMessages);
