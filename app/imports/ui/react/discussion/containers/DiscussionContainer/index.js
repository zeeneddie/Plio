import { connect } from 'react-redux';
import { composeWithTracker } from 'react-komposer';
import { compose, lifecycle, withProps } from 'recompose';
import { batchActions } from 'redux-batched-actions';
import get from 'lodash.get';

import { pickFromDiscussion } from '/imports/api/helpers';
import { DiscussionSubs } from '/imports/startup/client/subsmanagers';
import Discussion from '../../components/Discussion';
import { setAt, reset, setDiscussion } from '/client/redux/actions/discussionActions';
import { Discussions } from '/imports/share/collections/discussions';

const discussionLoad = ({ dispatch, urlItemId }, onData) => {
  const subscription = DiscussionSubs.subscribe('discussionsByStandardId', urlItemId);

  if (subscription.ready()) {
    const discussion = Discussions.findOne({ linkedTo: urlItemId });
    const reduxActions = [
      setDiscussion(discussion),
    ];

    dispatch(batchActions(reduxActions));
  }

  onData(null, {});

  return () => typeof subscription === 'function' && subscription.stop();
};

export default compose(
  connect(pickFromDiscussion(['discussion'])),
  composeWithTracker(discussionLoad, null, null, {
    shouldResubscribe: (props, nextProps) => props.urlItemId !== nextProps.urlItemId,
  }),
  withProps((props) => ({
    discussionId: get(props, 'discussion._id'),
  })),
  lifecycle({
    componentWillMount() {
      this.props.dispatch(setAt(FlowRouter.getQueryParam('at')));
    },
    componentWillUnmount() {
      this.props.dispatch(reset());
    },
  })
)(Discussion);
