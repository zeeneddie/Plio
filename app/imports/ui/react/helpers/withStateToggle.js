import { compose, withState, withHandlers } from 'recompose';
import { not } from 'ramda';

import { capitalize } from '../../../share/helpers';

export default (initialValue, prop, handle) => {
  const setProp = `set${capitalize(prop)}`;

  return compose(
    withState(prop, setProp, initialValue),
    withHandlers({
      [handle]: props => () => props[setProp](not),
    }),
  );
};
