import { Template } from 'meteor/templating';
import { CountSubs, DiscussionSubs, MessageSubs } from '/imports/startup/client/subsmanagers.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '/imports/api/messages/messages.js';
import { inspire } from '/imports/api/helpers.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';

Template.StandardsPage.viewmodel({
  share: ['messages' ,'window'],
  mixin: ['discussions', 'mobile', 'organization', 'standard', { 'counter': 'counter' }],
  _subHandlers: [],
  isReady: false,
  isDiscussionOpened: false,
  isInitialMessagesReady: false,
  autorun: [
    function() {
      const template = this.templateInstance;
      const organizationId = this.organizationId();
      const standardId = this.standardId();
      const discussionId = Object.assign({}, this.discussion())._id;
      const options = this.options();
      let _subHandlers = [];

      if (!standardId || !organizationId) return;

      if (this.isDiscussionOpened()) {
        Tracker.nonreactive(() => {
          const params = {
            limit: 100,
            at: FlowRouter.getQueryParam('at') || null
          };

          _subHandlers = _subHandlers.concat([
            DiscussionSubs.subscribe('discussionsByStandardId', standardId),
          ]);
        });

        if (discussionId) {
          const messagesHandle = MessageSubs.subscribe('messages', discussionId, options);
          if (!this.isInitialMessagesReady()) {
            _subHandlers = _subHandlers.concat([messagesHandle]);

            this.isInitialMessagesReady(messagesHandle.ready());
          }
        }
      } else {
        _subHandlers = [
         CountSubs.subscribe('messagesNotViewedCount', 'standard-messages-not-viewed-count-' + standardId, standardId)
       ];
      }

      this._subHandlers(_subHandlers);
    },
    function () {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
  onCreated() {
    const at = FlowRouter.getQueryParam('at');
    at && this.options({
			...this.options(),
			at
		});
  },
  classNames() {
    let left = 'content-list scroll';
    let right = 'content-cards hidden-sm-down scroll';

    if (this.isDiscussionOpened()) {
      left = right;
      right = 'content-cards content-cards-flush scroll';
    }

    return { left, right };
  },
  standard() {
    return this._getStandardByQuery({ _id: this.standardId() });
  },
  discussion() {
    return Object.assign({}, Discussions.findOne({ linkedTo: this.standardId(), isPrimary: true }));
  },
  messagesNotViewedCount() {
    const count = this.counter.get('standard-messages-not-viewed-count-' + this.standardId());
    return count;
  }
});
