import { Template } from 'meteor/templating';
import
  SelectOptionsContainer
  from '/imports/ui/react/data-export/containers/SelectOptionsContainer';

Template.DataExport.viewmodel({
  mixin: 'modal',
  getArgs() {
    const modal = this.modal();

    return {
      handleMethodResult: modal.handleMethodResult.bind(modal),
      component: SelectOptionsContainer,
      ...this.args(),
    };
  },
});
