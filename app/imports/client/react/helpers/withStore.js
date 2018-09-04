import PropTypes from 'prop-types';
import { withContext } from 'recompose';

import store from '../../store';

export default withContext(
  { store: PropTypes.object },
  () => ({ store }),
);
