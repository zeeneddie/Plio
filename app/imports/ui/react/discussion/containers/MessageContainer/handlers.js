import { FlowRouter } from 'meteor/kadira:flow-router';

import modal from '/imports/startup/client/mixins/modal';
import { setAt, removeMessage } from '/imports/client/store/actions/discussionActions';

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

export const remove = props => e =>
  props.dispatch(removeMessage(props, (dispatch) => (err, res) => !err && clearAtWithRouter(props)));
