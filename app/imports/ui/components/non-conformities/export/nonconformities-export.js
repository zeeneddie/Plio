import { Template } from 'meteor/templating';
import { mapping } from '/imports/api/data-export/mapping/nonConformities';
import { CollectionNames, ProblemsStatuses } from '/imports/share/constants';


Template.NonConformitiesExport.viewmodel({
  getArgs() {
    return {
      docType: CollectionNames.NCS,
      statuses: ProblemsStatuses,
      fields: Object.keys(mapping.fields).map(key => ({
        name: key,
        ...mapping.fields[key],
      })),
    };
  },
});
