import { Template } from 'meteor/templating';

import { extractIds } from '/imports/api/helpers.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { DocumentCardSubs, BackgroundSubs } from '/imports/startup/client/subsmanagers.js';


Template.NC_Page.viewmodel({
  mixin: ['nonconformity', 'organization'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function() {
      const organizationId = this.organizationId();
      const NCId = this.NCId();

      if (!organizationId || !NCId) return;
      
      const _subHandlers = [
        DocumentCardSubs.subscribe('nonConformityCard', { organizationId, _id: NCId }, {
          onReady() {
            BackgroundSubs.subscribe('nonConformitiesDeps', organizationId);
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
      collection: NonConformities,
      template: 'NC_List'
    };
  }
});
