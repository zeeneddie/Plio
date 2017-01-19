import { FlowRouter } from 'meteor/kadira:flow-router';

import modal from '/imports/startup/client/mixins/modal';
import { setAt, removeMessage } from '/imports/client/store/actions/discussionActions';

const setAtWithRouter = (val, { dispatch }) => {
  FlowRouter.setQueryParams({ at: val });

  dispatch(setAt(val));
};

const clearAtWithRouter = (props) => {
  if (props.isSelected) {
    setAtWithRouter(null, props);
  }
};

export const openUserDetails = ({ user }) => (e) => {
  e.preventDefault();

  modal.modal.open({
    user,
    template: 'UserDirectory_Card_Read_Inner',
    _title: 'User details',
  });
};

export const select = ({ dispatch, _id }) => () => dispatch(setAt(_id));

export const deselect = props => () => clearAtWithRouter(props);

export const remove = props => () => props.dispatch(
  removeMessage(props, () => err => !err && clearAtWithRouter(props))
);
