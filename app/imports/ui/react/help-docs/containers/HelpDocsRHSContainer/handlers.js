import { getId } from '/imports/api/helpers';
import modal from '/imports/startup/client/mixins/modal';

export const onModalOpen = props => () =>
  modal.modal.open({
    _title: 'Help document',
    template: 'HelpDocs_Edit',
    _id: getId(props.helpDoc),
  });
