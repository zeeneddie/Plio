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
  WORKSPACE_DEFAULTS,
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
      [WORKSPACE_DEFAULTS]: PropTypes.shape({
        [WorkspaceDefaultsTypes.DISPLAY_MESSAGES]: PropTypes.number,
      }).isRequired,
    }).isRequired,
  }),
  flattenProp('organization'),
  flattenProp(WORKSPACE_DEFAULTS),
  onlyUpdateForKeys(['_id', 'serialNumber', WorkspaceDefaultsTypes.DISPLAY_MESSAGES]),
  withState('isLimitEnabled', 'setIsLimitEnabled', true),
  composeWithTracker(({
    isLimitEnabled,
    _id: organizationId,
    serialNumber: orgSerialNumber,
    [WorkspaceDefaultsTypes.DISPLAY_MESSAGES]:
      displayMessages = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_MESSAGES],
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
      onData(null, {
        messages,
        count,
        orgSerialNumber,
      });
    }

    return () => countSub.stop();
  }, {
    propsToWatch: [
      'isLimitEnabled',
      '_id',
      'serialNumber',
      WorkspaceDefaultsTypes.DISPLAY_MESSAGES,
    ],
  }),
  withHandlers({
    loadAll: ({ setIsLimitEnabled }) => () => setIsLimitEnabled(false),
    loadLimited: ({ setIsLimitEnabled }) => () => setIsLimitEnabled(true),
    markAllAsRead: ({ organization: { _id } }) => () =>
      updateViewedByOrganization.call({ _id }, handleMethodResult()),
  }),
)(DashboardStatsUnreadMessages);
