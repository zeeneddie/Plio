import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../../../../../share/utils/tests/createContext';
import { DocumentTypes } from '../../../../../../share/constants';
import Errors from '../../../../../../share/errors';

describe('Mutation/deleteRelation', () => {
  let context;
  beforeAll(async () => {
    await __setupDB();

    context = createContext({});

    context.services.RelationService.delete = jest.fn();

    jest.doMock('../../../../../../share/collections', () => context.collections);
  });
  afterAll(__closeDB);
  beforeEach(async () => {
    context.services.RelationService.delete.mockClear();

    await __clearDB();
  });

  it('throws when both documents do not exist', async () => {
    const deleteRelation = require('../deleteRelation').default;
    const args = {
      input: {
        rel1: {
          documentId: faker.random.uuid(),
          documentType: DocumentTypes.KEY_PARTNER,
        },
        rel2: {
          documentId: faker.random.uuid(),
          documentType: DocumentTypes.GOAL,
        },
      },
    };

    await expect(deleteRelation({}, args, context)).rejects.toEqual(new Error(Errors.NOT_FOUND));
    expect(context.services.RelationService.delete).not.toHaveBeenCalled();
  });

  it('passes when first document exists', async () => {
    const deleteRelation = require('../deleteRelation').default;
    const organizationId = faker.random.uuid();
    await context.collections.Organizations.addMembers(
      { _id: organizationId },
      [context.userId],
    );
    const keyPartnerId = await context.collections.KeyPartners.insert({ organizationId });
    const args = {
      input: {
        rel1: {
          documentId: keyPartnerId,
          documentType: DocumentTypes.KEY_PARTNER,
        },
        rel2: {
          documentId: faker.random.uuid(),
          documentType: DocumentTypes.GOAL,
        },
      },
    };

    await expect(deleteRelation({}, args, context)).resolves.toEqual(expect.anything());
    expect(context.services.RelationService.delete).toHaveBeenCalled();
  });

  it('passes when second document exists', async () => {
    const deleteRelation = require('../deleteRelation').default;
    const organizationId = faker.random.uuid();
    await context.collections.Organizations.addMembers(
      { _id: organizationId },
      [context.userId],
    );
    const goalId = await context.collections.Goals.insert({ organizationId });
    const args = {
      input: {
        rel1: {
          documentId: faker.random.uuid(),
          documentType: DocumentTypes.KEY_PARTNER,
        },
        rel2: {
          documentId: goalId,
          documentType: DocumentTypes.GOAL,
        },
      },
    };

    await expect(deleteRelation({}, args, context)).resolves.toEqual({
      rel1: {
        documentType: args.input.rel1.documentType,
      },
      rel2: {
        documentType: args.input.rel2.documentType,
      },
    });
    expect(context.services.RelationService.delete).toHaveBeenCalled();
  });
});
