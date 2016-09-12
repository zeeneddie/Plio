import { Template } from 'meteor/templating';
import { CountSubs, DiscussionSubs, MessageSubs } from '/imports/startup/client/subsmanagers.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '/imports/api/messages/messages.js';
import { inspire } from '/imports/api/helpers.js';

Template.StandardsPage.viewmodel({
  share: 'window',
  mixin: ['discussions', 'mobile', 'organization', 'standard', { 'counter': 'counter' }],
  _subHandlers: [],
  isReady: false,
  isDiscussionOpened: false,
  autorun: [
    function() {
      const template = this.templateInstance;
      const organizationId = this.organizationId();
      const standardId = this.standardId();
      const discussionIds = this._getDiscussionIdsByStandardId(standardId);

      if (!standardId) return;

      let _subHandlers = [
        template.subscribe('departments', organizationId),
        template.subscribe('workItems', organizationId),
        template.subscribe('nonConformitiesByStandardId', standardId),
        CountSubs.subscribe('messagesNotViewedCount', 'standard-messages-not-viewed-count-' + standardId, standardId)
      ];

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
      }

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
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
  messagesNotViewedCount() {
    const count = this.counter.get('standard-messages-not-viewed-count-' + this.standardId());
    return count;
  }
});
