import { Template } from 'meteor/templating';

import { Risks } from '/imports/share/collections/risks.js';
import { DocumentCardSubs, BackgroundSubs } from '/imports/startup/client/subsmanagers.js';


Template.Risks_Page.viewmodel({
  mixin: ['risk', 'organization'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function() {
      const organizationId = this.organizationId();
      const riskId = this.riskId();

      if (!organizationId || !riskId) return;

      const _subHandlers = [
        DocumentCardSubs.subscribe('riskCard', { organizationId, _id: riskId }, {
          onReady() {
            BackgroundSubs.subscribe('risksDeps', organizationId);
          }
        })
      ];

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
  listArgs() {
    return {
      collection: Risks,
      template: 'Risks_List'
    };
  },
  cardArgs() {
    const isReady = this.isReady();
    const risk = Risks.findOne({ _id: this.riskId() });
    return {
      risk,
      isReady
    };
  }
});
