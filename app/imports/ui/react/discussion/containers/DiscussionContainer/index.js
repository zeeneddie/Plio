import { connect } from 'react-redux';
import { composeWithTracker } from 'react-komposer';
import { compose, lifecycle, withProps } from 'recompose';
import get from 'lodash.get';

import { pickFromDiscussion, pickDeep } from '/imports/api/helpers';
import { DiscussionSubs } from '/imports/startup/client/subsmanagers';
import Discussion from '../../components/Discussion';
import { setAt, reset, setDiscussion } from '/client/redux/actions/discussionActions';
import { Discussions } from '/imports/share/collections/discussions';

const discussionLoad = ({ dispatch, urlItemId }, onData) => {
  const subscription = DiscussionSubs.subscribe('discussionsByStandardId', urlItemId);

  if (subscription.ready()) {
    const discussion = Discussions.findOne({ linkedTo: urlItemId });

    dispatch(setDiscussion(discussion));
  }

  onData(null, {});

  return () => typeof subscription === 'function' && subscription.stop();
};

export default compose(
  connect(pickDeep(['organizations.organizationId', 'global.urlItemId'])),
  composeWithTracker(discussionLoad, null, null, {
    shouldResubscribe: (props, nextProps) => props.urlItemId !== nextProps.urlItemId,
  }),
  connect(pickFromDiscussion(['discussion'])),
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
