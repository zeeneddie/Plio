import PropTypes from 'prop-types';
import { setPropTypes } from 'recompose';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import moment from 'moment-timezone';

import DashboardStatsUnreadMessages from '../components/DashboardStatsUnreadMessages';
import { namedCompose } from '../../helpers';
import { composeWithTracker } from '../../../../client/util';
import { MessageSubs } from '../../../../startup/client/subsmanagers';
import { Messages, Files, Discussions } from '../../../../share/collections';
import { MessageTypes, DocumentTypes } from '../../../../share/constants';
import { removeEmails } from '../../../../share/mentions';
import { getFullNameOrEmail } from '../../../../api/users/helpers';

export default namedCompose('DashboardStatsUnreadMessagesContainer')(
  setPropTypes({
    organizationId: PropTypes.string.isRequired,
    orgSerialNumber: PropTypes.number.isRequired,
  }),
  composeWithTracker(({ organizationId, orgSerialNumber }, onData) => {
    let dummy = 0;
    const limit = 1;
    const countSub = Meteor.subscribe(
      'messagesNotViewedCountTotal',
      `unread-messages-count-${organizationId}`,
      organizationId,
      ++dummy,
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

      onData(null, { messages });
    }

    return () => countSub.stop();
  }),
)(DashboardStatsUnreadMessages);
