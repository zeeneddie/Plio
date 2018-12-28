import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../../../../../share/utils/tests/createContext';
import { DocumentTypes } from '../../../../../../share/constants';
import Errors from '../../../../../../share/errors';

describe('Mutation/createRelation', () => {
  let context;
  beforeAll(async () => {
    await __setupDB();

    context = createContext({});

    context.services.RelationService.insert = jest.fn();

    jest.doMock('../../../../../../share/collections', () => context.collections);
  });
  afterAll(__closeDB);
  beforeEach(async () => {
    context.services.RelationService.insert.mockClear();

    await __clearDB();
  });

  it('throws if any of documents does not exist', async () => {
    const createRelation = require('../createRelation').default;
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

    const promise = createRelation({}, args, context);
    await expect(promise).rejects.toEqual(new Error(Errors.NOT_FOUND));
    expect(context.services.RelationService.insert).not.toHaveBeenCalled();
  });

  it('throws if both documents are not of the same organization', async () => {
    const createRelation = require('../createRelation').default;
    const organizationId1 = faker.random.uuid();
    const organizationId2 = faker.random.uuid();

    await context.collections.Organizations.addMembers({ _id: organizationId1 }, [context.userId]);
    await context.collections.Organizations.addMembers({ _id: organizationId2 }, [context.userId]);
    const keyPartnerId = await context.collections.KeyPartners.insert({
      organizationId: organizationId1,
    });
    const goalId = await context.collections.Goals.insert({
      organizationId: organizationId2,
    });

    const args = {
      input: {
        rel1: {
          documentId: keyPartnerId,
          documentType: DocumentTypes.KEY_PARTNER,
        },
        rel2: {
          documentId: goalId,
          documentType: DocumentTypes.GOAL,
        },
      },
    };

    await expect(createRelation({}, args, context)).rejects.toMatchSnapshot();
    expect(context.services.RelationService.insert).not.toHaveBeenCalled();
  });

  it('throws if relation already exists', async () => {
    const createRelation = require('../createRelation').default;
    const organizationId = faker.random.uuid();

    await context.collections.Organizations.addMembers({ _id: organizationId }, [context.userId]);
    const keyPartnerId = await context.collections.KeyPartners.insert({ organizationId });
    const goalId = await context.collections.Goals.insert({ organizationId });
    const args = {
      input: {
        rel1: {
          documentId: keyPartnerId,
          documentType: DocumentTypes.KEY_PARTNER,
        },
        rel2: {
          documentId: goalId,
          documentType: DocumentTypes.GOAL,
        },
      },
    };
    const reversedArgs = {
      input: {
        rel1: {
          documentId: goalId,
          documentType: DocumentTypes.GOAL,
        },
        rel2: {
          documentId: keyPartnerId,
          documentType: DocumentTypes.KEY_PARTNER,
        },
      },
    };

    await context.collections.Relations.insert(args.input);
    await expect(createRelation({}, args, context)).rejects.toMatchSnapshot();
    await expect(createRelation({}, reversedArgs, context)).rejects.toMatchSnapshot();
  });

  it('passes', async () => {
    const createRelation = require('../createRelation').default;
    const organizationId = faker.random.uuid();

    await context.collections.Organizations.addMembers({ _id: organizationId }, [context.userId]);
    const keyPartnerId = await context.collections.KeyPartners.insert({ organizationId });
    const goalId = await context.collections.Goals.insert({ organizationId });
    const args = {
      input: {
        rel1: {
          documentId: keyPartnerId,
          documentType: DocumentTypes.KEY_PARTNER,
        },
        rel2: {
          documentId: goalId,
          documentType: DocumentTypes.GOAL,
        },
      },
    };

    await expect(createRelation({}, args, context)).resolves.toEqual({
      rel1: {
        documentType: args.input.rel1.documentType,
      },
      rel2: {
        documentType: args.input.rel2.documentType,
      },
    });
    expect(context.services.RelationService.insert).toHaveBeenCalled();
  });
});
