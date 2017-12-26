import { shouldUpdate, compose, withProps, withHandlers } from 'recompose';
import { eqProps } from 'ramda';
import connectUI from 'redux-ui';

import RiskSubcard from '../components/RiskSubcard';

export default compose(
  connectUI(),
  shouldUpdate((props, nextProps) => !!(
    props.ui.opened !== nextProps.ui.opened ||
    props.isOpen !== nextProps.isOpen ||
    !eqProps('risk', props, nextProps)
  )),
  withProps(({ ui: { opened }, risk: { _id } }) => ({ isOpen: opened === _id })),
  withHandlers({
    toggle: ({ updateUI, ui: { opened }, risk: { _id } }) => () =>
      updateUI('opened', opened === _id ? null : _id),
  }),
)(RiskSubcard);
