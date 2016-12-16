import { Template } from 'meteor/templating';
import { DocumentLayoutSubs } from '/imports/startup/client/subsmanagers.js';

Template.WorkInbox_Layout.viewmodel({
  mixin: ['organization', 'workInbox', 'nonconformity', 'risk'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function() {
      const orgSerialNumber = this.organizationSerialNumber();
      const isDeleted = { $in: [null, false, true] };
      const _subHandlers = [
        DocumentLayoutSubs.subscribe('workInboxLayout', orgSerialNumber, isDeleted)
      ];

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
