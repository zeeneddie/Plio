import { Meteor } from 'meteor/meteor';

import { setStandardMessagesNotViewedCountMap } from '/client/redux/actions/countersActions';
import _counter_ from '/imports/startup/client/mixins/counter';

export default function loadCountersData({ dispatch, standards }, onData) {
  const subscriptions = standards.map(({ _id }) => Meteor.subscribe(
    'messagesNotViewedCount',
    `standard-messages-not-viewed-count-${_id}`,
    _id
  ));

  if (subscriptions.every(subscription => subscription.ready())) {
    const unreadMessagesCountMap = standards.reduce((map, { _id }) => ({
      ...map,
      [_id]: _counter_.get(`standard-messages-not-viewed-count-${_id}`),
    }), {});

    dispatch(setStandardMessagesNotViewedCountMap(unreadMessagesCountMap));
  }

  onData(null, {});

  return () => subscriptions.map(subscription => subscription.stop());
}
