import { Template } from 'meteor/templating';
import get from 'lodash.get';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '/imports/api/messages/messages.js';
import { getFormattedDate } from '/imports/api/helpers.js';
import { bulkUpdateViewedBy } from '/imports/api/messages/methods.js';
import { MessageSubs } from '/imports/startup/client/subsmanagers.js';

Template.Discussion_Messages.viewmodel({
	mixin: ['discussions', 'messages', 'standard', 'user'],
	autorun() {
		MessageSubs.subscribe('messages', this.discussionId(), this.options());

		// const firstMessage = Object.assign([], this.messages()).find((m, i, arr) => !!arr.length);

		// this.templateInstance.subscribe(
		// 	'messagesByDiscussionIds',
		// 	[this.discussionId()],
		// 	{
		// 		at: get(firstMessage, '_id'),
		// 		limit: this.limit()
		// 	}
		// );
	},

	onRendered() {
		const discussionId = this.discussionId();
		const notifications = this.child('Notifications');

		if (discussionId) {
			bulkUpdateViewedBy.call({ discussionId });
		}

		// Subscribe notifications to messages
		this.notifyOnIncomeMessages();
	},
	options:  {
		limit: 50,
		sort: { createdAt: -1 },
		at: 'vvjMtX7PuXgwKduna'
	},
  // The _id of the primary discussion for this standardId
	discussion() {
		const discussion = Discussions.findOne({ _id: this.discussionId() });
		return discussion;
	},
	getStartedByText() {
		const creator = Meteor.users.findOne({ _id: get(this.discussion(), 'startedBy') });
		return this.userNameOrEmail(get(creator, '_id'));
	},
	getStartedAtText() {
		return getFormattedDate(this.discussion().startedAt, 'MMMM Do, YYYY');
	},
	messages() {
		const messages = (() => {
			const options = {
  			sort: { createdAt: 1 }
  		};
			const msg = this._getMessagesByDiscussionId(this.discussionId(), options);

			return msg.fetch();
		})();

		const messagesMapped = messages.map((message, i, arr) => {
			const { createdBy, createdAt } = message;

			const user = (() => {
				const query = { _id: createdBy };
				const options = {
					fields: {
						profile: 1,
						emails: 1,
						roles: 1
					}
				};

				return Meteor.users.findOne(query, options);
			})();

			const obj = (() => {
				const dateFormat = 'MMMM Do, YYYY';
				const timeFormat = 'h:mm A';
				const _id = message._id;
				const createdAt = message.createdAt;
				const date = createdAt ? getFormattedDate(createdAt, dateFormat) : null;
				const documentId = get(this.discussion(), 'linkedTo');

				return {
					_id,
					date,
					documentId,
					createdAt,
					user,
					dateToShow: (() => {
						const prevCreatedAt = get(messages[i - 1], 'createdAt');
						const prevMessageDate = prevCreatedAt ? getFormattedDate(prevCreatedAt, dateFormat) : null;

						return date !== prevMessageDate;
					})(),
					isMergedWithPreviousMessage: (() => {
						const prevMessage = messages[i - 1];
						const prevCreatedAt = get(prevMessage, 'createdAt');
						const prevCreatedBy = get(prevMessage, 'createdBy');

						if (message.createdBy === prevCreatedBy && message.createdAt - prevCreatedAt < 5 * 60 * 1000) {
							return true;
						}

						return false;
					})()
				};
			})();

			return Object.assign({}, message, obj);
		});

		return messagesMapped;
	},
	triggerLoadMore: _.throttle(function() {
		const tpl = this.templateInstance;

		if (tpl.$('.infinite-load-older').isAlmostVisible()) {

	  }
	}, 500),
	loadMore(direction = -1) {
		const messages = Object.assign([], this.messages());
		const options = Object.assign({}, this.options());
		const dir = parseInt(direction, 10);
		const msg = dir > 0 ? _.last(messages) : _.first(messages);
		this.options({
			limit: options.limit + 50,
			sort: { createdAt: dir },
			at: get(msg, '_id')
		});
		this.options.changed();
	},
	notification() {
		return this.child('Notifications');
	},
	notifyOnIncomeMessages() {
		const self = this;
		let init = true;
		const options = {
			sort: { createdAt: 1 }
		};
		const msg = this._getMessagesByDiscussionId(this.discussionId(), options);

		msg.observe({
			added(doc) {
				if (init) {
					return;
				}

				self.notification && self.notification().playSound();
				init = false;
			}
		});

		init = false;
	}
});
