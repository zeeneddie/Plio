import { compose, withState, withHandlers } from 'recompose';

import { not } from '/imports/api/helpers';
import { capitalize } from '/imports/share/helpers';

export default (initialValue, prop, handle) => {
  const setProp = `set${capitalize(prop)}`;

  return compose(
    withState(prop, setProp, initialValue),
    withHandlers({
      [handle]: props => () => props[setProp](not),
    }),
  );
};
