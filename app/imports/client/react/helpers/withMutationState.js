import { compose, withHandlers, withState } from 'recompose';
import { handleGQError } from '../../../api/handleGQError';

export default ({
  handleError = handleGQError,
} = {}) => compose(
  withState(
    'mutation',
    'setMutationState',
    ({ error = null, loading = false } = {}) => ({ error, loading }),
  ),
  withHandlers({
    mutateWithState: ({ setMutationState }) => (promise) => {
      setMutationState({ error: null, loading: true });

      return promise
        .then((res) => {
          setMutationState({
            loading: false,
            error: null,
          });
          return res;
        })
        .catch((err) => {
          setMutationState({
            loading: false,
            error: handleError(err),
          });
          throw err;
        });
    },
  }),
);
