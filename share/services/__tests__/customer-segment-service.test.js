import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';

import CustomerSegmentService from '../customer-segment-service';
import { CanvasColors, CanvasTypes } from '../../constants';
import createContext from '../../utils/tests/createContext';

describe('Customer segment service', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  test('insert', async () => {
    const args = {
      title: faker.random.word(),
      organizationId: faker.random.number(),
      color: faker.random.objectElement(CanvasColors),
      originatorId: context.userId,
      notes: faker.random.words(),
      percentOfMarketSize: faker.random.number({ min: 0, max: 100 }),
      matchedTo: {
        documentId: faker.random.uuid(),
        documentType: CanvasTypes.VALUE_PROPOSITION,
      },
    };

    const _id = await CustomerSegmentService.insert(args, context);
    const customerSegment = await context.collections.CustomerSegments.findOne({ _id });

    expect(customerSegment).toMatchObject({
      ...args,
      createdBy: context.userId,
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
    const valuePropositionId = await context.collections.ValuePropositions.insert(
      valuePropositionData,
    );

    await CustomerSegmentService.unmatch({ _id: customerSegmentId }, context);

    const valueProposition = await context.collections.ValuePropositions.findOne({
      _id: valuePropositionId,
    });
    expect(valueProposition).toEqual({ _id: valuePropositionId });
  });

  test('deleteRelations', async () => {
    const _id = await context.collections.CustomerSegments.insert({});
    const args = { _id };
    const linkedTo = { documentId: _id };

    const needId = await context.collections.Needs.insert({ linkedTo });
    const wantId = await context.collections.Wants.insert({ linkedTo });
    const relationId = await context.collections.Relations.insert({
      rel1: { documentId: needId },
      rel2: { documentId: wantId },
    });
    await CustomerSegmentService.deleteRelations(args, context);
    const need = await context.collections.Needs.findOne({ _id: needId });
    const want = await context.collections.Wants.findOne({ _id: wantId });
    const relation = await context.collections.Relations.findOne({ _id: relationId });

    expect(context.collections.Needs.find).toBeCalled();
    expect(context.collections.Wants.find).toBeCalled();
    expect(context.collections.Relations.remove).toBeCalled();
    expect(need).not.toBeNull();
    expect(want).not.toBeNull();
    expect(relation).toBeNull();
  });

  test('delete', async () => {
    CustomerSegmentService.unmatch = jest.fn();
    CustomerSegmentService.deleteRelations = jest.fn();

    const _id = await context.collections.CustomerSegments.insert({});
    const args = { _id };
    const linkedTo = { documentId: _id };
    const needId = await context.collections.Needs.insert({ linkedTo });
    const wantId = await context.collections.Wants.insert({ linkedTo });
    await CustomerSegmentService.delete(args, context);
    const need = await context.collections.Needs.findOne({ _id: needId });
    const want = await context.collections.Wants.findOne({ _id: wantId });

    expect(context.collections.CustomerSegments.remove).toHaveBeenCalledWith({ _id });
    expect(CustomerSegmentService.unmatch).toHaveBeenCalledWith(args, context);
    expect(CustomerSegmentService.deleteRelations).toHaveBeenCalledWith(args, context);
    expect(context.collections.Needs.remove).toBeCalled();
    expect(context.collections.Wants.remove).toBeCalled();
    expect(need).toBeNull();
    expect(want).toBeNull();
  });
});
