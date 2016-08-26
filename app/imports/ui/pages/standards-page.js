import { Template } from 'meteor/templating';
import { CountSubs } from '/imports/startup/client/subsmanagers.js';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '/imports/api/messages/messages.js';


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
      const arrDiscussionIds = this._getDiscussionIdsByStandardId(standardId);
      let _subHandlers = [
        template.subscribe('departments', organizationId),
        template.subscribe('nonConformitiesByStandardId', standardId),
        template.subscribe('workItems', organizationId),
        CountSubs.subscribe('messagesNotViewedCount', 'standard-messages-not-viewed-count-' + standardId, standardId)
      ];

      if (this.isDiscussionOpened()) {
        _subHandlers = _subHandlers.concat([
          template.subscribe('discussionsByStandardId', standardId),
          template.subscribe('messagesByDiscussionIds', arrDiscussionIds)
        ]);
      }

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
  standard() {
    return this._getStandardByQuery({ _id: this.standardId() });
  },
  messagesNotViewedCount() {
    const count = this.counter.get('standard-messages-not-viewed-count-' + this.standardId());
    return count;
  },
  styles() {
    return this.isDiscussionOpened() ? '' : this.display();
  }
});
