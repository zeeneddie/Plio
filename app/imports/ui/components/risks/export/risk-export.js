import { Template } from 'meteor/templating';
import { mapping } from '/imports/api/data-export/mapping/risks';
import { CollectionNames, ProblemsStatuses } from '/imports/share/constants';

Template.RiskExport.viewmodel({
  getArgs() {
    return {
      docType: CollectionNames.RISKS,
      statuses: ProblemsStatuses,
      fields: Object.keys(mapping.fields).map(key => ({
        name: key,
        ...mapping.fields[key],
      })),
    };
  },
});
