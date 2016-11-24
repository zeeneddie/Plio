import { Template } from 'meteor/templating';

import { Risks } from '/imports/share/collections/risks.js';
import { DiscussionSubs, DocumentCardSubs, BackgroundSubs } from '/imports/startup/client/subsmanagers.js';
import { Discussions } from '/imports/share/collections/discussions.js';

Template.Risks_Page.viewmodel({
  mixin: ['discussions', 'mobile', 'risk', 'organization', { 'counter': 'counter' }],
  _subHandlers: [],
  isReady: false,
  isDiscussionReady: false,
  isDiscussionOpened: false,
  messagesNotViewedCount: '',
  autorun: [
    function() {
      const organizationId = this.organizationId();
      const riskId = this.riskId();

      if (!organizationId || !riskId) return;

      const _subHandlers = [
        DocumentCardSubs.subscribe('riskCard', { organizationId, _id: riskId }, {
          onReady() {
            BackgroundSubs.subscribe('risksDeps', organizationId);
          }
        })
      ];

      this._subHandlers(_subHandlers);
    },
    function() {
      const docId = this.riskId();
      const organizationId = this.organizationId();
      if (!docId) return;

      if (this.isDiscussionOpened()) {
        const discussionHandle = DiscussionSubs.subscribe('discussionsByDocId', { docId, organizationId });
        this.isDiscussionReady(discussionHandle.ready());
      }
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
  listArgs() {
    return {
      collection: Risks,
      template: 'Risks_List'
    };
  },
  risk() {
    return this._getRiskByQuery({ _id: this.riskId() });
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
  discussion() {
    return Object.assign({}, Discussions.findOne({
      linkedTo: this.riskId(),
      isPrimary: true,
    }));
  },
  cardArgs() {
    const isReady = this.isReady();
    const risk = Risks.findOne({ _id: this.riskId() });
    return {
      risk,
      isReady,
      isDiscussionOpened: this.isDiscussionOpened(),
      messagesNotViewedCount: this.messagesNotViewedCount(),
    };
  },
  messagesNotViewedCount() {
    const count = this.counter.get('risk-messages-not-viewed-count-' + this.riskId());
    return count;
  },
});
