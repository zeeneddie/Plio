import { compose, mapProps } from 'recompose';
import { omit } from 'ramda';

export default compose(mapProps, omit);
