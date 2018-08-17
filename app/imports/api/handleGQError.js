import { replace, map, prop, compose, join } from 'ramda';
import { GQ_ERROR_MESSAGE_PREFIX, DEFAULT_ERROR_MESSAGE } from './constants';

const handleErrorMessage = compose(
  replace('; ', ';\n'),
  replace(GQ_ERROR_MESSAGE_PREFIX, ''),
);

const handleGraphQLErrors = compose(
  join('\n\n'),
  map(compose(handleErrorMessage, prop('message'))),
);

export const handleGQError = ({ networkError, graphQLErrors, message }) => {
  if (networkError) {
    return networkError;
  }
  if (graphQLErrors) {
    return handleGraphQLErrors(graphQLErrors);
  }
  if (message) {
    return handleErrorMessage(message);
  }
  return DEFAULT_ERROR_MESSAGE;
};
