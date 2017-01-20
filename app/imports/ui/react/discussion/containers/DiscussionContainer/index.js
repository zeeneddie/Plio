import { connect } from 'react-redux';
import { composeWithTracker } from 'react-komposer';
import { compose, lifecycle, withProps, withHandlers } from 'recompose';
import get from 'lodash.get';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { pickFromDiscussion, pickDeep } from '/imports/api/helpers';
import { DiscussionSubs } from '/imports/startup/client/subsmanagers';
import Discussion from '../../components/Discussion';
import { setAt, reset, setDiscussion } from '/imports/client/store/actions/discussionActions';
import { setShowCard } from '/imports/client/store/actions/mobileActions';
import { Discussions } from '/imports/share/collections/discussions';

const discussionLoad = ({ dispatch, urlItemId, organizationId }, onData) => {
  const subscription = DiscussionSubs.subscribe(
    'discussionsByDocId',
    { organizationId, docId: urlItemId }
  );

  if (subscription.ready()) {
    const discussion = Discussions.findOne({ linkedTo: urlItemId });

    dispatch(setDiscussion(discussion));
  }

  onData(null, {});

  return () => typeof subscription === 'function' && subscription.stop();
};

export default compose(
  connect(pickDeep([
    'organizations.organizationId',
    'global.urlItemId',
    'discussion.resetCompleted',
  ])),
  composeWithTracker(discussionLoad, null, null, {
    shouldResubscribe: (props, nextProps) =>
      props.urlItemId !== nextProps.urlItemId ||
      nextProps.resetCompleted,
  }),
  connect(({ collections, discussion }, { organizationId }) => ({
    discussion: discussion.discussion,
    users: collections.usersByOrgIds[organizationId],
  })),
  withProps((props) => ({
    discussionId: get(props, 'discussion._id'),
    documentPath: FlowRouter.current().path.replace('/discussion', ''),
  })),
  withHandlers({
    onBackArrowClick: (props) => (e) => {
      e.preventDefault();
      props.dispatch(setShowCard(true));
      FlowRouter.go(props.documentPath);
    },
  }),
  lifecycle({
    componentWillMount() {
      this.props.dispatch(setAt(FlowRouter.getQueryParam('at')));
    },
    componentWillUnmount() {
      this.props.dispatch(reset());
    },
  })
)(Discussion);
