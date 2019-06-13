import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import get from 'lodash.get';
import { compose, lifecycle, shouldUpdate } from 'recompose';
import { _ } from 'meteor/underscore';

import PreloaderPage from '/imports/client/react/components/PreloaderPage';
import { Messages } from '/imports/share/collections/messages';
import { Files } from '/imports/share/collections/files';

import {
  setMessages,
  setLoading,
  setLastMessageId,
  setResetCompleted,
  markMessagesAsRead,
} from '../../../../store/actions/discussionActions';
import { getState } from '../../../../../client/store';
import notifications from '../../../../../startup/client/mixins/notifications';
import { pickFromDiscussion, pickC, invoker, notEquals } from '../../../../../api/helpers';
import LastDiscussionMessage from '../../../../../client/collections/lastDiscussionMessage';
import { setFiles } from '../../../../store/actions/collectionsActions';
import { MESSAGES_PER_PAGE_LIMIT } from '../../constants';
import MessagesListWrapper from '../../components/MessagesListWrapper';
import { composeWithTracker } from '../../../../util';

const initObservers = () => {
  const handle = LastDiscussionMessage.find().observe({
    changed({ createdBy }) {
      const { userId } = getState().global;
      if (!Object.is(createdBy, userId)) {
        // play new-message sound if the sender is not a current user
        notifications.playNewMessageSound();
      }
    },
  });

  return () => handle.stop();
};

const initInterval = (fn) => {
  const handle = Meteor.setInterval(() => fn(), 3000);

  return () => Meteor.clearInterval(handle);
};

const shouldSubscribe = (props, nextProps) => {
  const pickProps = pickC(['priorLimit', 'followingLimit', 'discussionId', 'sort']);
  return (
    !props.resetCompleted && nextProps.resetCompleted ||
    notEquals(pickProps(props), pickProps(nextProps))
  );
};

const readMessages = (props) => {
  const getLastMessage = () => Object.assign({}, _.last(props.messages));

  props.dispatch(markMessagesAsRead(props.discussion, getLastMessage()));
};

const loadMessagesData = ({
  discussionId,
  dispatch,
  sort = { createdAt: -1 },
  at = null,
  priorLimit = MESSAGES_PER_PAGE_LIMIT,
  followingLimit = MESSAGES_PER_PAGE_LIMIT,
  resetCompleted = false,
}, onData) => {
  dispatch(setLoading(true));

  const subOpts = {
    sort, at, priorLimit, followingLimit,
  };
  const messagesSubscription = Meteor.subscribe('messages', discussionId, subOpts);
  const lastMessageSubscription = Meteor.subscribe('discussionMessagesLast', discussionId);
  const subscriptions = [messagesSubscription, lastMessageSubscription];

  if (subscriptions.every(invoker(0, 'ready'))) {
    const query = { discussionId };
    const options = { sort: { createdAt: 1 }, fields: { viewedBy: 0 } };
    const messages = Messages.find(query, options).fetch();
    const files = Files.find().fetch();
    const lastMessageId = Tracker.nonreactive(() =>
      get(LastDiscussionMessage.findOne(), 'lastMessageId'));

    let actions = [
      setLoading(false),
      setLastMessageId(lastMessageId),
      setMessages(messages),
      setFiles(files),
    ];

    if (resetCompleted) {
      actions = actions.concat(setResetCompleted(false));
    }

    dispatch(batchActions(actions));

    onData(null, {});
  }

  return () => subscriptions.map(invoker(0, 'stop'));
};

export default compose(
  connect(pickFromDiscussion([
    'at', 'sort', 'priorLimit', 'followingLimit', 'resetCompleted',
  ])),
  composeWithTracker(loadMessagesData, {
    shouldSubscribe,
    loadingHandler: PreloaderPage,
    propsToWatch: ['resetCompleted', 'priorLimit', 'followingLimit', 'discussionId', 'sort'],
  }),
  connect(state => ({
    userId: state.global.userId,
    ...pickFromDiscussion([
      'loading', 'messages', 'priorLimit',
      'followingLimit', 'lastMessageId', 'sort', 'discussion',
    ])(state),
  })),
  shouldUpdate(notEquals),
  lifecycle({
    componentWillMount() {
      readMessages(this.props);
      // run observer and interval that returns a cleanup function

      this.intervalCleanup = initInterval(() => readMessages(this.props));

      this.observerCleanup = initObservers();
    },
    componentWillUnmount() {
      readMessages(this.props);

      if (typeof this.observerCleanup === 'function') this.observerCleanup();
      if (typeof this.intervalCleanup === 'function') this.intervalCleanup();
    },
  }),
)(MessagesListWrapper);
