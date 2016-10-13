import { Template } from 'meteor/templating';
import { DocumentLayoutSubs } from '/imports/startup/client/subsmanagers.js';

Template.Risks_Layout.viewmodel({
  mixin: ['organization', 'risk'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function() {
      const orgSerialNumber = this.organizationSerialNumber();
      const isDeleted = this.isActiveRiskFilter(4)
        ? true
        : { $in: [null, false] };
      const _subHandlers = [
        DocumentLayoutSubs.subscribe('risksLayout', orgSerialNumber, isDeleted)
      ];

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
