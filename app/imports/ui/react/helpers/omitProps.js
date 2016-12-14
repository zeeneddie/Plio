import { compose, mapProps } from 'recompose';

import { omitC } from '/imports/api/helpers';

export default compose(mapProps, omitC);
