import { connect } from 'react-redux';
import { compose, lifecycle, withProps, withHandlers } from 'recompose';
import get from 'lodash.get';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { pickDeep, handleMethodResult, equals, getId, find } from '/imports/api/helpers';
import { DiscussionSubs } from '/imports/startup/client/subsmanagers';
import { setAt, reset, setDiscussion } from '/imports/client/store/actions/discussionActions';
import { setShowCard } from '/imports/client/store/actions/mobileActions';
import { Discussions } from '/imports/share/collections/discussions';
import { toggleMute } from '/imports/api/discussions/methods';
import Discussion from '../../components/Discussion';
import { composeWithTracker } from '../../../../../client/util';

const discussionLoad = ({ dispatch, urlItemId, organizationId }, onData) => {
  const subscription = DiscussionSubs.subscribe(
    'discussionsByDocId',
    { organizationId, docId: urlItemId },
  );

  if (subscription.ready()) {
    const discussion = Discussions.findOne({ linkedTo: urlItemId });

    dispatch(setDiscussion(discussion));
  }

  onData(null, {});
};

export default compose(
  connect(pickDeep([
    'organizations.organizationId',
    'global.urlItemId',
    'discussion.resetCompleted',
  ])),
  composeWithTracker(discussionLoad, {
    propsToWatch: ['urlItemId', 'resetCompleted'],
    shouldSubscribe: (props, nextProps) => !!(
      props.urlItemId !== nextProps.urlItemId ||
      nextProps.resetCompleted
    ),
  }),
  connect(({ collections, discussion, global: { userId } }, { organizationId }) => ({
    userId,
    discussion: discussion.discussion,
    users: collections.usersByOrgIds[organizationId],
  })),
  withProps(({ discussion, userId }) => ({
    discussionId: getId(discussion),
    documentPath: FlowRouter.current().path.replace('/discussion', ''),
    isMuted: !!find(equals(userId), get(discussion, 'mutedBy')),
  })),
  withHandlers({
    onToggleMute: ({ discussion: { _id } = {} }) => () =>
      toggleMute.call({ _id }, handleMethodResult),
    onBackArrowClick: ({ dispatch, documentPath }) => (e) => {
      e.preventDefault();
      dispatch(setShowCard(true));
      FlowRouter.go(documentPath);
    },
  }),
  lifecycle({
    componentWillMount() {
      this.props.dispatch(setAt(FlowRouter.getQueryParam('at')));
    },
    componentWillUnmount() {
      this.props.dispatch(reset());
    },
  }),
)(Discussion);
