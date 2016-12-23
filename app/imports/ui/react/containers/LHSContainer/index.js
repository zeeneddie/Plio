import { withState, withHandlers, compose } from 'recompose';

import { T, F } from '/imports/api/helpers';
import LHS from '../../components/LHS';

export default compose(
  withState('isFocused', 'setFocused', false),
  withHandlers({
    onFocus: props => () => props.setFocused(T),
    onBlur: props => () => props.setFocused(F),
  })
)(LHS);
