import { Meteor } from 'meteor/meteor';
import { Messages } from '/imports/share/collections/messages.js';
import { Discussions } from '/imports/share/collections/discussions.js';
import DiscussionsService from '../discussions/discussions-service.js';
import FilesService from '../files/files-service.js';

Messages.before.insert((userId, { discussionId }) => {
  if (Meteor.isServer) {
    const discussion = Discussions.findOne({ _id: discussionId });
    if (discussion && (!discussion.participants || !discussion.participants.includes(userId))) {
      DiscussionsService.participate(discussionId, userId);
    }
  }
});

Messages.after.insert((userId, { discussionId }) => {
  const discussion = Discussions.findOne({ _id: discussionId });
  if (discussion && !discussion.isStarted) DiscussionsService.start(discussionId, userId);
});

Messages.after.remove((userId, message) => {
  const fileId = message.fileId;
  if (fileId) {
    FilesService.remove({ _id: fileId });
  }
});
