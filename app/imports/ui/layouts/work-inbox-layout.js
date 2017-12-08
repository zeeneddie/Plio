import { Template } from 'meteor/templating';
import { DocumentLayoutSubs } from '/imports/startup/client/subsmanagers.js';

Template.WorkInbox_Layout.viewmodel({
  mixin: ['organization', 'workInbox', 'nonconformity', 'risk'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function () {
      const orgSerialNumber = this.organizationSerialNumber();
      const _subHandlers = [
        DocumentLayoutSubs.subscribe('workInboxLayout', orgSerialNumber),
      ];

      this._subHandlers(_subHandlers);
    },
    function () {
      const subHandlers = this._subHandlers();
      const isReady = subHandlers.length && subHandlers.every(handle => handle.ready());
      this.isReady(isReady);
    },
  ],
});
