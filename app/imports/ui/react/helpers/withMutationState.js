import { compose, withHandlers, withState } from 'recompose';

export default ({
  handleError = err => err.message,
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
