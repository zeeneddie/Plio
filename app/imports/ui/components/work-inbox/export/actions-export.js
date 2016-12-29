import { Template } from 'meteor/templating';
import { mapping } from '/imports/api/data-export/mapping/actions';
import { CollectionNames, ActionStatuses } from '/imports/share/constants';

Template.ActionsExport.viewmodel({
  getArgs() {
    return {
      docType: CollectionNames.ACTIONS,
      statuses: ActionStatuses,
      fields: Object.keys(mapping.fields).map(key => ({
        name: key,
        ...mapping.fields[key],
      })),
    };
  },
});
