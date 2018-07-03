import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { batchActions } from 'redux-batched-actions';

import { setUserId, setUrlItemId } from '/imports/client/store/actions/globalActions';

export default ({ dispatch }, onData) => {
  const userId = Meteor.userId();
  const urlItemId = FlowRouter.getParam('helpId');

  dispatch(batchActions([
    setUserId(userId),
    setUrlItemId(urlItemId),
  ]));

  onData(null, {});
};
