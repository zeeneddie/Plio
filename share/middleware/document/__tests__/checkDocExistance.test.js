import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';
import { T } from 'ramda';

import checkDocExistance from '../checkDocExistance';
import Errors from '../../../errors';

describe('checkDocExistance', () => {
  beforeAll(__setupDB);
  afterAll(__closeDB);

  const next = T;
  const root = {};
  const args = {};
  const context = {
    userId: null,
  };
  const getQuery = ({ _id }) => _id;

  it('throws', async () => {
    jest.doMock('../../../collections', () => ({
      Organizations: new Mongo.Collection('organizations'),
    }));
    const { Organizations } = require('../../../collections');
    const promise = checkDocExistance(getQuery, Organizations)(next, root, args, context);

    await expect(promise).rejects.toEqual(new Error(Errors.NOT_FOUND));
  });

  it('passes', async () => {
    jest.doMock('../../../collections', () => ({
      Organizations: new Mongo.Collection('organizations'),
    }));
    const { Organizations } = require('../../../collections');

    await Organizations.insert({ _id: 1 });

    const promise = checkDocExistance(getQuery, Organizations)(next, root, args, context);

    await expect(promise).resolves.toBe(true);
  });
});
