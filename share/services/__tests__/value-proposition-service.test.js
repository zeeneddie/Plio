import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

import ValuePropositionService from '../value-proposition-service';
import { CanvasColors, CanvasTypes } from '../../constants';

describe('Value proposition service', () => {
  let ValuePropositions;

  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    ValuePropositions = new Mongo.Collection('ValuePropositions');
  });

  test('insert', async () => {
    const userId = 2;
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
    const context = {
      userId,
      collections: { ValuePropositions },
    };

    const _id = await ValuePropositionService.insert(args, context);
    const valueProposition = await ValuePropositions.findOne({ _id });

    expect(valueProposition).toMatchObject({
      ...args,
      createdBy: userId,
    });
  });
});
