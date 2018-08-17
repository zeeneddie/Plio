import { Template } from 'meteor/templating';
import { DocumentLayoutSubs } from '../../../startup/client/subsmanagers';
import { WorkInboxFilterIndexes } from '../../../api/constants';

Template.WorkInbox_Layout.viewmodel({
  mixin: ['organization', 'workInbox', 'nonconformity', 'risk'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function () {
      const orgSerialNumber = this.organizationSerialNumber();
      const isDeleted = (
        this.isActiveWorkInboxFilter(WorkInboxFilterIndexes.MY_DELETED) ||
        this.isActiveWorkInboxFilter(WorkInboxFilterIndexes.TEAM_DELETED)
      );
      const _subHandlers = [
        DocumentLayoutSubs.subscribe('workInboxLayout', orgSerialNumber, isDeleted),
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
