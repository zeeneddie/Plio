import { __setupDB, __closeDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../../utils/tests/createContext';
import { generateSerialNumber } from '../../../helpers';
import CustomerElementService from '../CustomerElementService';

jest.mock('../../../helpers', () => ({
  generateSerialNumber: jest.fn(() => 1),
}));

describe('Customer element service', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
    CustomerElementService.collection = jest.fn(() => context.collections.Benefits);
  });
  afterAll(__closeDB);

  test('insert', async () => {
    const args = {
      organizationId: faker.random.uuid(),
      title: faker.random.word(),
      description: faker.random.words(),
      importance: faker.random.number(),
      linkedTo: [{
        documentId: faker.random.uuid(),
        documentType: faker.random.word(),
      }],
    };
    const _id = await CustomerElementService.insert(args, context);
    const benefit = await context.collections.Benefits.findOne({ _id });

    expect(_id).toEqual(expect.any(String));
    expect(CustomerElementService.collection).toHaveBeenCalledWith(context);
    expect(generateSerialNumber).toHaveBeenCalledWith(
      context.collections.Benefits,
      { organizationId: args.organizationId },
    );
    expect(benefit).toEqual({
      ...args,
      _id,
      serialNumber: 1,
      createdBy: context.userId,
    });
  });
});
