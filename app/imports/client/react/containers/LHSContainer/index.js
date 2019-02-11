import { withState, withHandlers, compose } from 'recompose';
import { memo } from 'react';

import { T, F } from '/imports/api/helpers';
import LHS from '../../components/LHS';

export default compose(
  memo,
  withState('isFocused', 'setFocused', false),
  withHandlers({
    onFocus: props => () => props.setFocused(T),
    onBlur: props => () => props.setFocused(F),
  }),
)(LHS);
