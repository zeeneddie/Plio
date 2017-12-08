import { Template } from 'meteor/templating';

import { DocumentCardSubs, BackgroundSubs } from '/imports/startup/client/subsmanagers.js';

Template.WorkInbox_Page.viewmodel({
  mixin: ['organization', 'nonconformity', 'workInbox'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function loadCardAndBackgroundData() {
      const organizationId = this.organizationId();
      const workItemId = this.workItemId();
      const filter = this.activeWorkInboxFilterId();

      if (!organizationId) return;

      if (workItemId) {
        const subscriptionName = (filter === 5 || filter === 6) ? 'actionCard' : 'workInboxCard';

        const _subHandlers = [
          DocumentCardSubs.subscribe(subscriptionName, { organizationId, _id: workItemId }, {
            onReady() {
              BackgroundSubs.subscribe('workInboxDeps', organizationId);
            },
          }),
        ];

        this._subHandlers(_subHandlers);
      } else {
        BackgroundSubs.subscribe('workInboxDeps', organizationId);
      }
    },
    function trackReadyState() {
      const subHandlers = this._subHandlers();
      const isReady = subHandlers.length && subHandlers.every(handle => handle.ready());
      this.isReady(isReady);
    },
  ],
});
