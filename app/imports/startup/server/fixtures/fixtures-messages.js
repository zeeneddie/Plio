import MessagesService from '/imports/api/messages/messages-service.js';
import { Discussions } from '/imports/api/discussions/discussions.js'
import { Messages } from '/imports/api/messages/messages.js'

const discussionId = '9RLXg3H62oAecYKF8';

if (Messages.find({ discussionId }).count() === 0) {
  const limit = 1000;

  for (let i = 0; i < limit; i++) {
    MessagesService.insert({
      discussionId: '9RLXg3H62oAecYKF8',
      message : `Text message ${i + 1}`,
      type : 'text',
      createdAt : new Date,
      createdBy : 'SQHmBKJ94gJvpLKLt',
      updatedAt : new Date,
      updatedBy : 'SQHmBKJ94gJvpLKLt'
    });
  }

  console.log(`Inserted ${limit} messages into the discussion`);
}
