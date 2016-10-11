import { Template } from 'meteor/templating';
import { DocumentLayoutSubs } from '/imports/startup/client/subsmanagers.js';

Template.StandardsLayout.viewmodel({
  mixin: ['organization', 'standard'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function() {
      const orgSerialNumber = this.organizationSerialNumber();
      const isDeleted = this.isActiveStandardFilter(3)
        ? true
        : { $in: [null, false] };

      const _subHandlers = [
        DocumentLayoutSubs.subscribe('standardsLayout', orgSerialNumber, isDeleted)
      ];

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
