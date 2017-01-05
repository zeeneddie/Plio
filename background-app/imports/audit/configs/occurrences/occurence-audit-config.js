import { CollectionNames } from '/imports/share/constants.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Occurrences } from '/imports/share/collections/occurrences.js';
import NCAuditConfig from '../non-conformities/nc-audit-config.js';

import onCreated from './on-created.js';
import onRemoved from './on-removed.js';

import date from './fields/date.js';
import description from './fields/description.js';


export default OccurenceAuditConfig = {

  collection: Occurrences,

  collectionName: CollectionNames.OCCURRENCES,

  onCreated,

  updateHandlers: [
    date,
    description
  ],

  onRemoved,

  docId({ _id }) {
    return _id;
  },

  docDescription(doc) {
    return 'occurrence';
  },

  docName({ sequentialId }) {
    return sequentialId;
  },

  docOrgId({ nonConformityId }) {
    const { organizationId } = NonConformities.findOne({ _id: nonConformityId });
    return organizationId;
  },

  docUrl({ nonConformityId }) {
    const NC = NonConformities.findOne({ _id: nonConformityId });

    return NCAuditConfig.docUrl(NC);
  }

};
