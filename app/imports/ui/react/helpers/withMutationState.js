import connectUI from 'redux-ui';
import { compose, withHandlers } from 'recompose';

export default ({
  handleError = err => err.message,
} = {}) => compose(
  connectUI({
    state: {
      loading: false,
      error: null,
    },
  }),
  withHandlers({
    mutateWithState: ({ updateUI }) => (promise) => {
      updateUI('loading', true);

      return promise
        .then((res) => {
          updateUI({
            loading: false,
            error: null,
          });
          return res;
        })
        .catch((err) => {
          updateUI({
            loading: false,
            error: handleError(err),
          });
          throw err;
        });
    },
  }),
);
