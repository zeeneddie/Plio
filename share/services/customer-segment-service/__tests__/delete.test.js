import { __setupDB, __closeDB } from 'meteor/mongo';

import createContext from '../../../utils/tests/createContext';
import deleteCustomerSegment from '../delete';
import unmatch from '../unmatch';
import { cleanupCanvas } from '../../util/cleanup';

jest.mock('../unmatch');
jest.mock('../../util/cleanup');

describe('CustomerSegmentService.delete', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();
    context = createContext({});
  });
  afterAll(__closeDB);

  test('delete', async () => {
    const _id = await context.collections.CustomerSegments.insert({});
    const customerSegment = await context.collections.CustomerSegments.findOne({ _id });
    const args = { _id };
    const linkedTo = { documentId: _id };
    const needId = await context.collections.Needs.insert({ linkedTo });
    const wantId = await context.collections.Wants.insert({ linkedTo });
    await deleteCustomerSegment(args, { ...context, customerSegment });
    const need = await context.collections.Needs.findOne({ _id: needId });
    const want = await context.collections.Wants.findOne({ _id: wantId });
    const ctx = { ...context, customerSegment };

    expect(context.collections.CustomerSegments.remove).toHaveBeenCalledWith({ _id });
    expect(unmatch).toHaveBeenCalledWith(args, ctx);
    expect(cleanupCanvas).toHaveBeenCalledWith(customerSegment, ctx);
    expect(context.collections.Needs.remove).toHaveBeenCalled();
    expect(context.collections.Wants.remove).toHaveBeenCalled();
    expect(need).toBeNull();
    expect(want).toBeNull();
  });
});
