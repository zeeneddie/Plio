import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

import RevenueStreamService from '../revenue-stream-service';
import { CanvasColors } from '../../constants';

describe('Revenue stream service', () => {
  let RevenueStreams;

  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    RevenueStreams = new Mongo.Collection('RevenueStreams');
  });

  test('insert', async () => {
    const userId = 2;
    const args = {
      title: 'Hello World',
      organizationId: 1,
      color: CanvasColors.INDIGO,
      percentOfRevenue: 0,
      percentOfProfit: 100,
      originatorId: userId,
      notes: 'dlsadsad',
    };
    const context = {
      userId,
      collections: { RevenueStreams },
    };

    const _id = await RevenueStreamService.insert(args, context);
    const revenueStream = await RevenueStreams.findOne({ _id });

    expect(revenueStream).toMatchObject({
      ...args,
      createdBy: userId,
    });
  });
});
