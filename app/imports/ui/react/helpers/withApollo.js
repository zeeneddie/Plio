import PropTypes from 'prop-types';
import { withContext } from 'recompose';

import { client } from '../../../client/apollo';

export default withContext(
  { client: PropTypes.object },
  () => ({ client }),
);
