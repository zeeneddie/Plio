import { Template } from 'meteor/templating';
import { DocumentLayoutSubs } from '/imports/startup/client/subsmanagers.js';

Template.WorkInbox_Layout.viewmodel({
  mixin: ['organization', 'workInbox', 'nonconformity', 'risk'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function() {
      const orgSerialNumber = this.organizationSerialNumber();
      const isDeleted = (this.isActiveWorkInboxFilter(5) ||
                        this.isActiveWorkInboxFilter(6))
        ? true
        : { $in: [null, false] };
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
