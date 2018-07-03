import { Template } from 'meteor/templating';
import DataExport from '/imports/client/react/data-export/containers/DataExportContainer';

Template.DataExport.viewmodel({
  mixin: 'modal',
  getArgs() {
    const modal = this.modal();

    return {
      handleMethodResult: modal.handleMethodResult.bind(modal),
      component: DataExport,
      ...this.args(),
    };
  },
});
