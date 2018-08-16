import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

import KeyActivityService from '../key-activity-service';
import { CanvasColors } from '../../constants';

describe('Key activity service', () => {
  let KeyActivities;

  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    KeyActivities = new Mongo.Collection('KeyActivities');
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
      collections: { KeyActivities },
    };

    const _id = await KeyActivityService.insert(args, context);
    const keyActivity = await KeyActivities.findOne({ _id });

    expect(keyActivity).toMatchObject({
      ...args,
      createdBy: userId,
    });
  });
});
