import { Template } from 'meteor/templating';
import { DiscussionSubs, OrgSettingsDocSubs, DocumentCardSubs } from '/imports/startup/client/subsmanagers.js';

import { Discussions } from '/imports/api/discussions/discussions.js';

Template.StandardsPage.viewmodel({
  mixin: ['discussions', 'mobile', 'organization', 'standard', { 'counter': 'counter' }],
  _subHandlers: [],
  isReady: false,
  isDiscussionOpened: false,
  autorun: [
    function() {
      const template = this.templateInstance;
      const organizationId = this.organizationId();
      const standardId = this.standardId();
      const discussionId = Object.assign({}, this.discussion())._id;

      if (!standardId || !organizationId) return;

      let _subHandlers = [
        DocumentCardSubs.subscribe('standardCard', { _id: standardId, organizationId })
      ];

      if (this.isDiscussionOpened()) {
        _subHandlers = _subHandlers.concat([
          DiscussionSubs.subscribe('discussionsByStandardId', standardId),
        ]);
      }

      this._subHandlers(_subHandlers);
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
