import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

import ChannelService from '../channel-service';
import { CanvasColors } from '../../constants';

describe('Channel service', () => {
  let Channels;

  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    Channels = new Mongo.Collection('Channels');
  });

  test('insert', async () => {
    const userId = 2;
    const args = {
      title: 'Hello World',
      organizationId: 1,
      color: CanvasColors.INDIGO,
      originatorId: userId,
      notes: 'dlsadsad',
    };
    const context = {
      userId,
      collections: { Channels },
    };

    const _id = await ChannelService.insert(args, context);
    const channel = await Channels.findOne({ _id });

    expect(channel).toMatchObject({
      ...args,
      createdBy: userId,
    });
  });
});
