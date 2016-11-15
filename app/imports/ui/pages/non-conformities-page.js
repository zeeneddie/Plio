import { Template } from 'meteor/templating';

import { extractIds } from '/imports/api/helpers.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { DiscussionSubs, DocumentCardSubs, BackgroundSubs } from '/imports/startup/client/subsmanagers.js';
import { Discussions } from '/imports/share/collections/discussions.js';


Template.NC_Page.viewmodel({
  mixin: ['discussions', 'nonconformity', 'organization'],
  _subHandlers: [],
  isReady: false,
  isDiscussionReady: false,
  isDiscussionOpened: false,
  autorun: [
    function() {
      const organizationId = this.organizationId();
      const NCId = this.NCId();
      const discussionId = Object.assign({}, this.discussion())._id;

      if (!organizationId || !NCId) return;

      const _subHandlers = [
        DocumentCardSubs.subscribe('nonConformityCard', { organizationId, _id: NCId }, {
          onReady() {
            BackgroundSubs.subscribe('nonConformitiesDeps', organizationId);
          }
        })
      ];

      this._subHandlers(_subHandlers);
    },
    function() {
      const docId = this.NCId();
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
    return Object.assign({}, Discussions.findOne({ linkedTo: this.NCId(), isPrimary: true }));
  },
  listArgs() {
    return {
      collection: NonConformities,
      template: 'NC_List'
    };
  }
});
