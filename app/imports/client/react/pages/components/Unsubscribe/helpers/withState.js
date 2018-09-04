import { compose, withState, flattenProp } from 'recompose';

import UnsubscribePage from '../';

export default enhancer => compose(
  withState('state', 'setState', { loading: true, error: null }),
  enhancer,
  flattenProp('state'),
)(UnsubscribePage);
