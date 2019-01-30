import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import { PubSub } from 'graphql-subscriptions';

import createContext from '../../../../../../share/utils/tests/createContext';
import resolveEntityChanged from '../resolveEntityChanged';

jest.mock('../../../../../../share/middleware', () => ({
  checkLoggedIn: jest.fn(() => (next, root, args, context) => next(root, args, context)),
  checkOrgMembership: jest.fn(() => (next, root, args, context) => next(root, args, context)),
}));

describe('resolveEntityChanged', () => {
  let context;
  const createTestData = (organizationId, kind) => ({
    test: {
      entity: { organizationId },
      kind,
    },
  });

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
  });
  afterAll(__closeDB);
  beforeEach(async () => {
    await __clearDB();

    context.pubsub = new PubSub();
  });

  it('resolves if correct organizationId provided', async () => {
    const args = { organizationId: 1 };
    const iter = resolveEntityChanged('test')({}, args, context);
    const data = createTestData(1);

    context.pubsub.publish('test', data);

    await expect(iter.next()).resolves.toMatchObject({ value: data });
  });

  it('does not resolve if incorrect organizationId provided', async (done) => {
    const args = { organizationId: 1 };
    const iter = resolveEntityChanged('test')({}, args, context);

    context.pubsub.publish('test', createTestData(2));

    iter.next().then(() => done.fail('this should not have been called'));

    setTimeout(done, 0);
  });

  it('subscribes to provided kinds', async (done) => {
    const args = { organizationId: 1, kind: ['insert', 'delete'] };
    const iter = resolveEntityChanged('test')({}, args, context);

    context.pubsub.publish('test', createTestData(1, 'insert'));
    context.pubsub.publish('test', createTestData(1, 'delete'));
    context.pubsub.publish('test', createTestData(1, 'update'));

    await expect(iter.next()).resolves.toEqual(expect.anything());
    await expect(iter.next()).resolves.toEqual(expect.anything());

    iter.next().then(() => done.fail('this should not have been called'));

    setTimeout(done, 0);
  });
});
