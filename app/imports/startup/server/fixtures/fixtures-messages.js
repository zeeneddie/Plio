import MessagesService from '/imports/api/messages/messages-service.js';
import { Discussions } from '/imports/api/discussions/discussions.js'
import { Messages } from '/imports/api/messages/messages.js'

export const insertMessageFixtures = (limit = 1000) => {
  const standardId = 'Zty4NCagWvrcuLYoy';
  const discussion = Discussions.findOne({ linkedTo: standardId });
  const discussionId = discussion && discussion._id;

  if (Messages.find({ discussionId }).count() === 0) {
    for (let i = 0; i < limit; i++) {
      MessagesService.insert({
        discussionId,
        message : `Text message ${i + 1}`,
        type : 'text',
        createdAt : new Date,
        createdBy : 'SQHmBKJ94gJvpLKLt',
        updatedAt : new Date,
        updatedBy : 'SQHmBKJ94gJvpLKLt',
        organizationId: 'KwKXz5RefrE5hjWJ2'
      });
    }

    console.log(`Inserted ${limit} messages into the discussion`);
    return true;
  }

  return false;
}
