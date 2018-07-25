import { Template } from 'meteor/templating';

import { NonConformities } from '/imports/share/collections/non-conformities.js';
import {
  DiscussionSubs,
  DocumentCardSubs,
  BackgroundSubs,
} from '/imports/startup/client/subsmanagers.js';
import { Discussions } from '/imports/share/collections/discussions.js';

Template.NC_Page.viewmodel({
  mixin: ['discussions', 'mobile', 'nonconformity', 'organization', { counter: 'counter' }],
  _subHandlers: [],
  isReady: false,
  isDiscussionReady: false,
  isDiscussionOpened: false,
  autorun: [
    function () {
      const organizationId = this.organizationId();
      const NCId = this.NCId();
      let _subHandlers = [BackgroundSubs.subscribe('nonConformitiesDeps', organizationId)];

      if (!organizationId || !NCId) return;

      _subHandlers = _subHandlers.concat([
        DocumentCardSubs.subscribe('nonConformityCard', { organizationId, _id: NCId }),
      ]);

      this._subHandlers(_subHandlers);
    },
    function () {
      const docId = this.NCId();
      const organizationId = this.organizationId();
      if (!docId) return;

      if (this.isDiscussionOpened()) {
        const subArgs = { docId, organizationId };
        const discussionHandle = DiscussionSubs.subscribe('discussionsByDocId', subArgs);
        this.isDiscussionReady(discussionHandle.ready());
      }
    },
    function () {
      const subHandlers = this._subHandlers();
      const isReady = subHandlers.length && subHandlers.every(handle => handle.ready());
      this.isReady(isReady);
    },
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
  NC() {
    return this._getNCByQuery({ _id: this.NCId() });
  },
  discussion() {
    return Object.assign({}, Discussions.findOne({ linkedTo: this.NCId(), isPrimary: true }));
  },
  listArgs() {
    return {
      collection: NonConformities,
      template: 'NC_List',
    };
  },
  messagesNotViewedCount() {
    const count = this.counter.get(`nc-messages-not-viewed-count-${this.NCId()}`);
    return count;
  },
});
