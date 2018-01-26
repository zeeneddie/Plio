import { T } from 'ramda';
import checkLoggedIn from '../checkLoggedIn';

describe('checkLoggedIn', () => {
  it('passes', async () => {
    const next = T;
    const root = {};
    const args = {};
    const context = { userId: 1 };
    const result = await checkLoggedIn()(next, root, args, context);

    expect(result).toBe(true);
  });

  it('throws', async () => {
    const next = T;
    const root = {};
    const args = {};
    const context = {};
    const promise = checkLoggedIn()(next, root, args, context);
    const expected = new Error(403);

    await expect(promise).rejects.toEqual(expected);
  });
});
