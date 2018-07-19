import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

import CustomerSegmentService from '../customer-segment-service';
import { CanvasColors, CanvasTypes } from '../../constants';

describe('Customer segment service', () => {
  let CustomerSegments;

  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    CustomerSegments = new Mongo.Collection('CustomerSegments');
  });

  test('insert', async () => {
    const userId = 2;
    const args = {
      title: 'Hello World',
      organizationId: 1,
      color: CanvasColors.INDIGO,
      originatorId: userId,
      notes: 'dlsadsad',
      percentOfMarketSize: 50,
      matchedTo: {
        documentId: 3,
        documentType: CanvasTypes.VALUE_PROPOSITION,
      },
    };
    const context = {
      userId,
      collections: { CustomerSegments },
    };

    const _id = await CustomerSegmentService.insert(args, context);
    const customerSegment = await CustomerSegments.findOne({ _id });

    expect(customerSegment).toMatchObject({
      ...args,
      createdBy: userId,
    });
  });
});
