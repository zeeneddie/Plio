import { T } from 'ramda';
import ensureCanUpdateEndDate from '../ensureCanUpdateEndDate';
import Errors from '../../../errors';

describe('ensureCanUpdateEndDate', () => {
  it('throws if end date lt start date', async () => {
    const startDate = new Date();
    const endDate = new Date();

    startDate.setDate(endDate.getDate() + 1);

    const next = T;
    const root = { startDate };
    const args = { endDate };
    const context = {};
    const promise = ensureCanUpdateEndDate()(next, root, args, context);

    await expect(promise).rejects.toEqual(new Error(Errors.END_DATE_LTE_START_DATE));
  });

  it('passes', async () => {
    const endDate = new Date();
    const startDate = new Date(endDate.getDate() - 1);
    const next = T;
    const root = { startDate };
    const args = { endDate };
    const context = {};
    const promise = ensureCanUpdateEndDate()(next, root, args, context);

    await expect(promise).resolves.toBe(true);
  });
});
