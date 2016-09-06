import { Messages } from './messages.js';
import { Discussions } from '../discussions/discussions.js';
import DiscussionsService from '../discussions/discussions-service.js';
import FilesService from '../files/files-service.js';

Messages.after.insert((userId, { discussionId }) => {
  const discussion = Discussions.findOne({ _id: discussionId });
  if (discussion && !discussion.isStarted) {
    DiscussionsService.start(discussionId, userId);
  }
});

Messages.after.remove((userId, message) => {
  const fileId = message.fileId;
  if (fileId) {
    FilesService.remove({ _id: fileId })
  }
});
