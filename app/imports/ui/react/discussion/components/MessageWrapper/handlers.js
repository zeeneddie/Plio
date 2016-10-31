import { FlowRouter } from 'meteor/kadira:flow-router';

import modal from '/imports/startup/client/mixins/modal';
import { setAt } from '/client/redux/actions/discussionActions';
import { remove as removeMessage } from '/imports/api/messages/methods';
import { handleMethodResult } from '/imports/api/helpers';

const setAtWithRouter = (val, props) => {
  FlowRouter.setQueryParams({ at: val });
  props.dispatch(setAt(val));
}

const clearAtWithRouter = (props) => {
  if (props.isSelected) {
    setAtWithRouter(null, props);
  }
}

export const openUserDetails = (props) => {
  return (e) => {
    e.preventDefault();

    modal.modal.open({
      template: 'UserDirectory_Card_Read_Inner',
      _title: 'User details',
      user: props.user
    });
  };
}

export const select = props => e => props.dispatch(setAt(props._id));

export const deselect = props => e => clearAtWithRouter(props);

export const remove = (props) => {
  return (e) => {
    if (!isAuthor(props)) return;

    swal({
      title: 'Are you sure you want to delete this message?',
      text: 'This cannot be undone.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      closeOnConfirm: true
    },
    () => {
      const cb = (err, res) => !err && clearAtWithRouter(props);

      return removeMessage.call({ _id: props._id }, handleMethodResult(cb));
    });
  };
};
