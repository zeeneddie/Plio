export const composeMiddleware = (...functions) => {
  if (functions.length === 1) {
    return functions[0];
  }

  return functions.reduceRight((f, next) => (...args) => next(f, ...args));
};

export default function applyMiddleware(...middleware) {
  middleware.forEach((layer) => {
    if (typeof layer !== 'function') {
      throw new TypeError('Expected all provided middleware to be functions.');
    }
  });

  return (handler) => {
    if (typeof handler !== 'function') {
      // eslint-disable-next-line max-len
      throw new TypeError('Expected handler to be a function. Middleware can only be applied to functions.');
    }

    return composeMiddleware(...middleware, handler);
  };
}
