import PropTypes from 'prop-types';
import { withContext } from 'recompose';

import { client } from '../../apollo';

export default withContext(
  { client: PropTypes.object },
  () => ({ client }),
);
