import { Template } from 'meteor/templating';
import { DiscussionSubs, OrgSettingsDocSubs, DocumentCardSubs, BackgroundSubs } from '/imports/startup/client/subsmanagers.js';

import { Discussions } from '/imports/api/discussions/discussions.js';

Template.StandardsPage.viewmodel({
  mixin: ['discussions', 'mobile', 'organization', 'standard', { 'counter': 'counter' }],
  _subHandlers: [],
  isReady: false,
  isDiscussionReady: false,
  isDiscussionOpened: false,
  autorun: [
    function() {
      const template = this.templateInstance;
      const organizationId = this.organizationId();
      const standardId = this.standardId();
      const discussionId = Object.assign({}, this.discussion())._id;
      if (!standardId || !organizationId) return;

      const _subHandlers = [
        DocumentCardSubs.subscribe('standardCard', { organizationId, _id: standardId }, {
          onReady() {
            // subscribe to the rest of the documents needed in modal in the background
            BackgroundSubs.subscribe('GLOBAL_DEPS', organizationId);
          }
        })
      ];

      this._subHandlers(_subHandlers);
    },
    function() {
      const standardId = this.standardId();

      if (!standardId) return;

      if (this.isDiscussionOpened()) {
        const discussionHandle = DiscussionSubs.subscribe('discussionsByStandardId', standardId);
        this.isDiscussionReady(discussionHandle.ready());
      }
    },
    function () {
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
  discussion() {
    return Object.assign({}, Discussions.findOne({ linkedTo: this.standardId(), isPrimary: true }));
  },
  messagesNotViewedCount() {
    const count = this.counter.get('standard-messages-not-viewed-count-' + this.standardId());
    return count;
  }
});
