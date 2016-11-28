import { setIsDiscussionOpened } from '/client/redux/actions/discussionActions';

export default function loadIsDiscussionOpened({ dispatch, isDiscussionOpened = false }, onData) {
  dispatch(setIsDiscussionOpened());

  onData(null, {});
}
