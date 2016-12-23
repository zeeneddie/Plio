import { setIsDiscussionOpened } from '/imports/client/store/actions/discussionActions';

export default function loadIsDiscussionOpened({ dispatch, isDiscussionOpened = false }, onData) {
  dispatch(setIsDiscussionOpened(isDiscussionOpened));

  onData(null, {});
}
