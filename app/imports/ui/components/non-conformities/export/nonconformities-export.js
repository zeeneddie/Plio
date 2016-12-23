import { Template } from 'meteor/templating';
import { mapping, sections } from '/imports/api/data-export/mapping/nonConformities';
import { CollectionNames } from '/imports/share/constants';

Template.NonConformitiesExport.viewmodel({
  getArgs() {
    return {
      sections,
      docType: CollectionNames.NCS,
      fields: Object.keys(mapping.fields).map(key => ({
        name: key,
        ...mapping.fields[key],
      })),
    };
  },
});
