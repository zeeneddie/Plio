import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

describe('meteor/mongo', async () => {
  beforeEach(async () => __setupDB());
  afterEach(async () => __closeDB());

  test('insert', async () => {
    const Items = new Mongo.Collection('items');
    const id = await Items.insert({ a: 1 });

    expect(id).toEqual(expect.any(String));
  });

  test('findOne', async () => {
    const value = 123;
    const Items = new Mongo.Collection('items');
    const _id = await Items.insert({ value });
    const item = await Items.findOne({ _id });

    expect(item).toEqual({ _id, value });
  });

  test('update', async () => {
    const value = 123;
    const nextValue = 321;
    const Items = new Mongo.Collection('items');
    const _id = await Items.insert({ value });
    const n = await Items.update({ _id }, { $set: { value: nextValue } });

    expect(n).toBe(1);

    const item = await Items.findOne({ _id });
    expect(item).toEqual({ _id, value: nextValue });
  });

  test('find', async () => {
    const Items = new Mongo.Collection('items');
    await Items.insert({ a: 1, b: 1 });
    await Items.insert({ a: 1, b: 2 });
    const cursor = Items.find({ a: 1 });
    const items = await cursor.fetch();
    const count = await cursor.count();

    expect(count).toBe(2);
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ a: 1, b: 1 });
    expect(items[1]).toMatchObject({ a: 1, b: 2 });
  });

  test('remove', async () => {
    const Items = new Mongo.Collection('items');
    const _id = await Items.insert({ a: 1 });
    const n = await Items.remove({ _id });
    const count = await Items.find().count();

    expect(n).toBe(1);
    expect(count).toBe(0);
  });

  test('predefined collection', async () => {
    jest.doMock('../../../collections', jest.fn(() => ({
      Organizations: new Mongo.Collection('organizations'),
    })));
    const { Organizations } = require('../../../collections');
    const obj = { foo: 'bar' };

    await Organizations.insert(obj);
    const organizations = await Organizations.find(obj).fetch();

    expect(organizations).toHaveLength(1);
    expect(organizations[0]).toMatchObject(obj);
  });
});
