import { CollectionNames } from '/imports/share/constants';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Occurrences } from '/imports/share/collections/occurrences';
import NCAuditConfig from '../non-conformities/nc-audit-config';

import onCreated from './on-created';
import onRemoved from './on-removed';

import date from './fields/date';
import description from './fields/description';


export default OccurenceAuditConfig = {

  collection: Occurrences,

  collectionName: CollectionNames.OCCURRENCES,

  onCreated,

  updateHandlers: [
    date,
    description,
  ],

  onRemoved,

  docId({ _id }) {
    return _id;
  },

  docDescription() {
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
  },

};
