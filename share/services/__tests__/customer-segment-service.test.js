import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';
import faker from 'faker';

import CustomerSegmentService from '../customer-segment-service';
import { CanvasColors, CanvasTypes } from '../../constants';

describe('Customer segment service', () => {
  const userId = 2;
  let CustomerSegments;
  let ValuePropositions;
  let context;

  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    ValuePropositions = new Mongo.Collection('ValuePropositions');
    CustomerSegments = new Mongo.Collection('CustomerSegments');
    context = {
      userId,
      collections: { ValuePropositions, CustomerSegments },
    };
  });

  test('insert', async () => {
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

    const _id = await CustomerSegmentService.insert(args, context);
    const customerSegment = await CustomerSegments.findOne({ _id });

    expect(customerSegment).toMatchObject({
      ...args,
      createdBy: userId,
    });
  });

  test('unmatch', async () => {
    const customerSegmentId = faker.random.uuid();
    const valuePropositionData = {
      matchedTo: {
        documentId: customerSegmentId,
        documentType: CanvasTypes.CUSTOMER_SEGMENT,
      },
    };
    const valuePropositionId = await ValuePropositions.insert(valuePropositionData);

    await CustomerSegmentService.unmatch({ _id: customerSegmentId }, context);

    const valueProposition = await ValuePropositions.findOne({ _id: valuePropositionId });
    expect(valueProposition).toEqual({ _id: valuePropositionId });
  });

  test('delete', async () => {
    const customerSegmentId = await CustomerSegments.insert({});
    CustomerSegmentService.unmatch = jest.fn();

    await CustomerSegmentService.delete({ _id: customerSegmentId }, context);

    const customerSegment = await CustomerSegments.findOne({ _id: customerSegmentId });
    expect(CustomerSegmentService.unmatch).toHaveBeenCalled();
    expect(customerSegment).toBe(null);
  });
});
