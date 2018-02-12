import { T } from 'ramda';
import validateUpdateStartDate from '../validateUpdateStartDate';
import Errors from '../../../../errors';

describe('validateUpdateStartDate', () => {
  it('throws if start date gte end date', async () => {
    const endDate = new Date();
    const startDate = new Date();

    startDate.setDate(endDate.getDate() + 1);

    const next = T;
    const root = {};
    const args = { startDate };
    const context = {
      doc: { endDate },
    };
    const promise = validateUpdateStartDate()(next, root, args, context);

    await expect(promise).rejects.toEqual(new Error(Errors.START_DATE_GTE_END_DATE));
  });

  it('passes', async () => {
    const endDate = new Date();
    const startDate = new Date(endDate.getDate() - 1);
    const next = T;
    const root = {};
    const args = { startDate };
    const context = { doc: { endDate } };
    const promise = validateUpdateStartDate()(next, root, args, context);

    await expect(promise).resolves.toBe(true);
  });
});
