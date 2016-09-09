import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';
import invoke from 'lodash.invoke';
import property from 'lodash.property';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '/imports/api/messages/messages.js';
import { getFormattedDate, $isScrolledToBottom, $scrollToBottom } from '/imports/api/helpers.js';
import { bulkUpdateViewedBy } from '/imports/api/messages/methods.js';
import { MessageSubs } from '/imports/startup/client/subsmanagers.js';
import { wheelDirection, handleMouseWheel } from '/client/lib/scroll.js';
import { swipedetect, isMobile } from '/client/lib/mobile.js';

Template.Discussion_Messages.viewmodel({
	share: 'messages', // _scrollProps, isInitialDataReady, options
	mixin: ['discussions', 'messages', 'standard', 'user', 'utils'],
	isReady: true,
	lastMessage: new Mongo.Collection('lastDiscussionMessage'),
	isInitialDataReady: false,
	onCreated(template) {
		this.options({
			...this.options(),
			at: FlowRouter.getQueryParam('at')
		});

		template.autorun(() => {
			const discussionId = this.discussionId();

			if (!discussionId) return;

			MessageSubs.subscribe('messages', discussionId, this.options());
			template.subscribe('discussionMessagesLast', discussionId);

			const isReady = MessageSubs.ready();

			if (isReady && !this.isInitialDataReady()) {
				this.isInitialDataReady(true);
			}

			// hack which scrolls to the last position after new messages were prepended
			(() => {
				Tracker.afterFlush(() => {
					const { $chat, direction, scrollHeight, scrollPosition } = Object.assign({}, this._scrollProps());

					if (Object.is(direction, -1)) {
						$chat.scrollTop(scrollPosition + $chat.prop('scrollHeight') - $chat.prop('clientHeight') - scrollHeight);
					}
				});
			})();

			this.isReady(isReady);
		});
	},
	onRendered(template) {
		const discussionId = this.discussionId();

		if (discussionId) {
			bulkUpdateViewedBy.call({ discussionId });
		}

		const $chat = Object.assign($(), this.chat);
		!isMobile() && handleMouseWheel($chat[0], this.triggerLoadMore.bind(this), 'addEventListener');

		isMobile() && swipedetect($chat[0], this.triggerLoadMore.bind(this));

		// scroll to the bottom if the previous position before new message was at the bottom of chat box
		this.lastMessage().find().observeChanges({
			changed() {
				const prev = $isScrolledToBottom($chat);
				Meteor.setTimeout(() => {
					const cur = $isScrolledToBottom($chat);
					if (prev && !cur) {
						$scrollToBottom($chat);
					}
				}, 200);
			}
		});
	},
	onDestroyed(template) {
		const $chat = Object.assign($(), this.chat);
		handleMouseWheel($chat[0], this.triggerLoadMore.bind(this), 'removeEventListener');
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
		return getFormattedDate(get(this.discussion(), 'startedAt'), 'MMMM Do, YYYY');
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
	triggerLoadMore: _.throttle(function(e) {
		const loadOlderHandler = this.templateInstance.$('.infinite-load-older');
		const loadNewerHandler = this.templateInstance.$('.infinite-load-newer');
		const onLoadOlder = () => loadOlderHandler.isAlmostVisible() && this.loadMore(-1);
		const onLoadNewer = () => {
			const messages = Object.assign([], this.messages());
			const lastMessageId = get(this.lastMessage().findOne(), 'lastMessageId');

			if (!messages.map(property('_id')).includes(lastMessageId)) {
				if (loadNewerHandler.isAlmostVisible()) {
					this.loadMore(1);
				}
			}
		};

		if (e instanceof Event) {
			this.handleMouseEvents(e, onLoadOlder, onLoadNewer);
		} else {
			this.handleTouchEvents(e, onLoadOlder, onLoadNewer);
		}
	}, 1000),
	handleTouchEvents(dir, onLoadOlder, onLoadNewer) {
		if (Object.is(dir, 'down')) {
			onLoadOlder.call(this);
		} else if (Object.is(dir, 'up')) {
			onLoadNewer.call(this);
		}
	},
	handleMouseEvents(e, onLoadOlder, onLoadNewer) {
		const dir = wheelDirection(e);

		if (dir > 0) {
			// upscroll
			onLoadOlder.call(this);
		} else {
			// downscroll
			onLoadNewer.call(this);
		}
	},
	loadMore(direction = -1) {
		const messages = Object.assign([], this.messages());
		const options = Object.assign({}, this.options());
		const dir = parseInt(direction, 10);
		const msg = dir > 0 ? _.last(messages) : _.first(messages);
		const $chat = Object.assign($(), this.chat);
		const scrollPosition = $chat.scrollTop();
		const scrollHeight = $chat.prop('scrollHeight') - $chat.prop('clientHeight');

		this.options({
			limit: options.limit + 50,
			sort: { createdAt: dir },
			at: get(msg, '_id')
		});

		this._scrollProps({ $chat, scrollPosition, scrollHeight, direction });
	}
});
