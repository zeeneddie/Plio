import { Template } from 'meteor/templating';
import { DocumentLayoutSubs } from '/imports/startup/client/subsmanagers.js';
let p1, p2;

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

      p1 = performance.now();
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    },
    function() {
      if (this.isReady()) {
          p2 = performance.now();
          console.log(p2 - p1);
      }
    }
  ]
});
