import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

import CustomerRelationshipService from '../customer-relationship-service';
import { CanvasColors } from '../../constants';

describe('Customer relationship service', () => {
  let CustomerRelationships;

  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    CustomerRelationships = new Mongo.Collection('CustomerRelationships');
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
      collections: { CustomerRelationships },
    };

    const _id = await CustomerRelationshipService.insert(args, context);
    const customerRelationship = await CustomerRelationships.findOne({ _id });

    expect(customerRelationship).toMatchObject({
      ...args,
      createdBy: userId,
    });
  });
});
