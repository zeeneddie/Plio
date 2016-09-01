import { Messages } from './messages.js';
import { Discussions } from '../discussions/discussions.js';
import DiscussionsService from '../discussions/discussions-service.js';

Messages.after.insert((userId, { discussionId }) => {
  const discussion = Discussions.findOne({ _id: discussionId });
  if (discussion && !discussion.isStarted) {
    DiscussionsService.start(discussionId, userId);
  }
});
