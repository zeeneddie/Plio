import { __setupDB, __closeDB } from 'meteor/mongo';

import createContext from '../../../utils/tests/createContext';
import deleteValueProposition from '../delete';
import unmatch from '../unmatch';
import { cleanupCanvas } from '../../util/cleanup';

jest.mock('../unmatch');
jest.mock('../../util/cleanup');

describe('ValuePropositionService.delete', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();
    context = createContext({});
  });
  afterAll(__closeDB);

  test('delete', async () => {
    const _id = await context.collections.ValuePropositions.insert({});
    const valueProposition = await context.collections.ValuePropositions.findOne({ _id });
    const ctx = { ...context, valueProposition };
    const args = { _id };
    const linkedTo = { documentId: _id };
    const benefitId = await context.collections.Benefits.insert({ linkedTo });
    const featureId = await context.collections.Features.insert({ linkedTo });
    await deleteValueProposition(args, { ...context, valueProposition });
    const benefit = await context.collections.Benefits.findOne({ _id: benefitId });
    const feature = await context.collections.Features.findOne({ _id: featureId });

    expect(context.collections.ValuePropositions.remove).toHaveBeenCalledWith({ _id });
    expect(unmatch).toHaveBeenCalledWith(args, ctx);
    expect(context.collections.Benefits.remove).toHaveBeenCalled();
    expect(context.collections.Features.remove).toHaveBeenCalled();
    expect(cleanupCanvas).toHaveBeenCalledWith(valueProposition, ctx);
    expect(benefit).toBeNull();
    expect(feature).toBeNull();
  });
});
