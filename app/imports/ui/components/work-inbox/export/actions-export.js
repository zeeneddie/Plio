import { Template } from 'meteor/templating';
import { mapping, sections } from '/imports/api/data-export/mapping/actions';
import { CollectionNames } from '/imports/share/constants';

Template.ActionsExport.viewmodel({
  getArgs() {
    return {
      sections,
      docType: CollectionNames.ACTIONS,
      fields: Object.keys(mapping.fields).map(key => ({
        name: key,
        ...mapping.fields[key],
      })),
    };
  },
});
