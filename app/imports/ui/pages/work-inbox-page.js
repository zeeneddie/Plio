import { Template } from 'meteor/templating';

import { Occurrences } from '/imports/share/collections/occurrences.js';
import { DocumentCardSubs } from '/imports/startup/client/subsmanagers.js';
import { getCollectionByDocType } from '/imports/share/helpers';
import { DocumentTypes } from '/imports/share/constants';


Template.WorkInbox_Page.viewmodel({
  mixin: ['organization', 'nonconformity', 'workInbox'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function() {
      const organizationId = this.organizationId();
      const workItemId = this.workItemId();

      if (!organizationId) return;

      const _subHandlers = [
        DocumentCardSubs.subscribe('workInboxCard', { organizationId, _id: workItemId }, {
          onReady() {
            BackgroundSubs.subscribe('workInboxDeps', organizationId);
          }
        })
      ];

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
