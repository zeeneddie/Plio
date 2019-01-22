import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';
import faker from 'faker';
import { identity, times } from 'ramda';

import checkDocsAccess from '../checkDocsAccess';

describe('checkDocsAccess', () => {
  let root = {};
  const args = { ids: times(faker.random.uuid, 3) };
  let context = {};
  let organizationId;

  beforeAll(async () => {
    await __setupDB();
    const Organizations = new Mongo.Collection('Organizations');
    const Risks = new Mongo.Collection('Risks');
    const Departments = new Mongo.Collection('Departments');
    context = {
      userId: faker.random.uuid(),
      collections: { Organizations, Risks, Departments },
    };
  });

  afterAll(__closeDB);

  beforeEach(async () => {
    await Promise.all(Object.values(context.collections).map(collection => collection.remove({})));

    organizationId = await context.collections.Organizations.insert({
      users: [{ userId: context.userId, isRemoved: false }],
    });
    await Promise.all(args.ids.map(_id =>
      context.collections.Departments.insert({ _id, organizationId })));
    const _id = await context.collections.Risks.insert({ departmentsIds: args.ids });
    root = await context.collections.Risks.findOne({ _id });
  });

  it('throws if no entities, queries or ids provided', async () => {
    const promise = checkDocsAccess()(identity, {}, {}, context);

    await expect(promise).rejects.toEqual(expect.any(Error));
  });

  it('passes if ids provided', async () => {
    const config = (_, { ids }, { collections: { Departments } }) => ({
      ids,
      collection: Departments,
    });
    const promise = checkDocsAccess(config)(identity, root, args, context);

    await expect(promise).resolves.toEqual(root);
  });

  it('passes if queries provided', async () => {
    const config = (_, { ids }, { collections: { Departments } }) => ({
      queries: ids.map(id => ({ _id: id })),
      collection: Departments,
    });
    const promise = checkDocsAccess(config)(identity, root, args, context);

    await expect(promise).resolves.toEqual(root);
  });

  it('passes if entities provided', async () => {
    const config = async (_, { ids }, { collections: { Departments } }) => ({
      entities: await Departments.find({ _id: { $in: ids } }).fetch(),
    });
    const promise = checkDocsAccess(config)(identity, root, args, context);

    await expect(promise).resolves.toEqual(root);
  });
});
