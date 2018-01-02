import PropTypes from 'prop-types';
import { setPropTypes, withState, withHandlers } from 'recompose';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import moment from 'moment-timezone';

import DashboardStatsUnreadMessages from '../components/DashboardStatsUnreadMessages';
import { namedCompose } from '../../helpers';
import { composeWithTracker } from '../../../../client/util';
import { MessageSubs } from '../../../../startup/client/subsmanagers';
import { Messages, Files, Discussions } from '../../../../share/collections';
import { updateViewedByOrganization } from '../../../../api/discussions/methods';
import {
  MessageTypes,
  DocumentTypes,
  WorkspaceDefaults,
  WorkspaceDefaultsTypes,
} from '../../../../share/constants';
import Counter from '../../../../api/counter/client';
import { removeEmails } from '../../../../share/mentions';
import { getFullNameOrEmail } from '../../../../api/users/helpers';
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
  withState('isLimitEnabled', 'setIsLimitEnabled', true),
  composeWithTracker(({
    isLimitEnabled,
    organization: {
      _id: organizationId,
      serialNumber: orgSerialNumber,
      workspaceDefaults: {
        displayMessages = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_MESSAGES],
      } = {},
    },
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
      const messages = Messages.find(query, options).fetch().map((message) => {
        const {
          type,
          discussionId,
          createdBy,
          createdAt,
          _id,
        } = message;
        const messageData = {
          _id,
          text: '',
          extension: null,
        };

        if (type === MessageTypes.FILE) {
          const { fileId } = message;
          const file = Files.findOne({ _id: fileId });
          if (file) {
            const { name: text, extension } = file;
            Object.assign(messageData, { text, extension });
          }
        } else {
          const { text } = message;
          Object.assign(messageData, { text: removeEmails(text) });
        }

        const discussion = Discussions.findOne({ _id: discussionId });

        if (!discussion) return null;

        const { linkedTo, documentType } = discussion;

        let path = '';
        const params = { orgSerialNumber, urlItemId: linkedTo };
        const queryParams = { at: message._id };
        if (documentType === DocumentTypes.STANDARD) {
          path = 'standardDiscussion';
        } else if (documentType === DocumentTypes.NON_CONFORMITY) {
          path = 'nonConformityDiscussion';
        } else if (documentType === DocumentTypes.RISK) {
          path = 'riskDiscussion';
        }

        const url = FlowRouter.path(
          path,
          params,
          queryParams,
        );

        const user = Meteor.users.findOne({ _id: createdBy });

        Object.assign(messageData, {
          url,
          fullName: getFullNameOrEmail(user),
          timeString: moment(createdAt).from(new Date(), true),
        });

        return messageData;
      });
      const count = Counter.get(`unread-messages-count-${organizationId}`);
      const hasItemsToLoad = count > messages.length;
      const hiddenUnreadMessagesNumber = count - displayMessages;
      onData(null, {
        messages,
        count,
        hasItemsToLoad,
        hiddenUnreadMessagesNumber,
      });
    }

    return () => countSub.stop();
  }),
  withHandlers({
    loadAll: ({ setIsLimitEnabled }) => () => setIsLimitEnabled(false),
    loadLimited: ({ setIsLimitEnabled }) => () => setIsLimitEnabled(true),
    markAllAsRead: ({ organization: { _id } }) => () =>
      updateViewedByOrganization.call({ _id }, handleMethodResult()),
  }),
)(DashboardStatsUnreadMessages);
