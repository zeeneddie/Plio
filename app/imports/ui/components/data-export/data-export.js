import { Template } from 'meteor/templating';
import
  SelectOptionsContainer
  from '/imports/ui/react/data-export/containers/SelectOptionsContainer';

Template.DataExport.viewmodel({
  exportOptions() {
    return SelectOptionsContainer;
  },
});
