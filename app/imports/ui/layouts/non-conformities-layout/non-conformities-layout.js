import { Template } from 'meteor/templating';
import { DocumentLayoutSubs } from '/imports/startup/client/subsmanagers.js';

Template.NC_Layout.viewmodel({
  mixin: ['organization', 'nonconformity'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function () {
      const orgSerialNumber = this.organizationSerialNumber();
      const isDeleted = this.isActiveNCFilter(4);
      const _subHandlers = [
        DocumentLayoutSubs.subscribe('nonConformitiesLayout', orgSerialNumber, isDeleted),
      ];

      this._subHandlers(_subHandlers);
    },
    function () {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    },
  ],
});
