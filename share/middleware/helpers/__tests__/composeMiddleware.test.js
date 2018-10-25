import { identity } from 'ramda';

import composeMiddleware from '../composeMiddleware';

describe('Middleware/helpers/composeMiddleware', () => {
  const next = jest.fn(identity);
  const middleware1 = jest.fn((n, r) => n(r));
  const middleware2 = jest.fn((n, r) => n(r));
  const root = { a: 1 };

  it('composes middleware', async () => {
    const result = await composeMiddleware(middleware1, middleware2)(next, root);
    expect(middleware1).toHaveBeenCalled();
    expect(middleware2).toHaveBeenCalledWith(next, root);
    expect(result).toEqual(root);
  });
});
