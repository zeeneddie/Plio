import { MessageService } from '../../../share/services';
import { Discussions, Messages } from '../../../share/collections';

export const insertMessageFixtures = (limit = 1000) => {
  const standardId = 'Zty4NCagWvrcuLYoy';
  const discussion = Discussions.findOne({ linkedTo: standardId });
  const discussionId = discussion && discussion._id;

  if (discussionId && Messages.find({ discussionId }).count() === 0) {
    for (let i = 0; i < limit; i += 1) {
      MessageService.insert({
        discussionId,
        text: `Text message ${i + 1}`,
        type: 'text',
        createdAt: new Date(),
        createdBy: 'SQHmBKJ94gJvpLKLt',
        updatedAt: new Date(),
        updatedBy: 'SQHmBKJ94gJvpLKLt',
        organizationId: 'KwKXz5RefrE5hjWJ2',
      }, { userId: 'SQHmBKJ94gJvpLKLt' });
    }

    console.log(`Inserted ${limit} messages into the discussion`);
    return true;
  }

  return false;
};
