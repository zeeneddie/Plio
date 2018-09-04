import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';
import faker from 'faker';

import ValuePropositionService from '../value-proposition-service';
import { CanvasColors, CanvasTypes } from '../../constants';

describe('Value proposition service', () => {
  const userId = 2;
  let ValuePropositions;
  let CustomerSegments;
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
      matchedTo: {
        documentId: 3,
        documentType: CanvasTypes.CUSTOMER_SEGMENT,
      },
    };

    const _id = await ValuePropositionService.insert(args, context);
    const valueProposition = await ValuePropositions.findOne({ _id });

    expect(valueProposition).toMatchObject({
      ...args,
      createdBy: userId,
    });
  });

  test('unmatch', async () => {
    const valuePropositionId = faker.random.uuid();
    const customerSegmentData = {
      matchedTo: {
        documentId: valuePropositionId,
        documentType: CanvasTypes.VALUE_PROPOSITION,
      },
    };
    const customerSegmentId = await CustomerSegments.insert(customerSegmentData);

    await ValuePropositionService.unmatch({ _id: valuePropositionId }, context);

    const customerSegment = await CustomerSegments.findOne({ _id: customerSegmentId });
    expect(customerSegment).toEqual({ _id: customerSegmentId });
  });

  test('delete', async () => {
    const valuePropositionId = await ValuePropositions.insert({});
    ValuePropositionService.unmatch = jest.fn();

    await ValuePropositionService.delete({ _id: valuePropositionId }, context);

    const valueProposition = await ValuePropositions.findOne({ _id: valuePropositionId });
    expect(ValuePropositionService.unmatch).toHaveBeenCalled();
    expect(valueProposition).toBe(null);
  });
});
