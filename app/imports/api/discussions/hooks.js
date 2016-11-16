import { Messages } from '/imports/share/collections/messages.js';
import { Discussions } from '/imports/share/collections/discussions.js';
import MessagesService from '../discussions/discussions-service.js';

Discussions.after.remove((userId, discussion) => {
  const discussionId = discussion._id;
  if (discussionId) {
    Messages.remove({ discussionId });
    console.log('Message removeddd!!!');
  }
});
