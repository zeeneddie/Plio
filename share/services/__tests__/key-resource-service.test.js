import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

import KeyResourceService from '../key-resource-service';
import { CanvasColors } from '../../constants';

describe('Key resource service', () => {
  let KeyResources;

  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    KeyResources = new Mongo.Collection('KeyResources');
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
      collections: { KeyResources },
    };

    const _id = await KeyResourceService.insert(args, context);
    const keyResource = await KeyResources.findOne({ _id });

    expect(keyResource).toMatchObject({
      ...args,
      createdBy: userId,
    });
  });
});
