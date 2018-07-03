import { compose, withState, lifecycle, branch, renderNothing } from 'recompose';
import { identity, T } from 'ramda';

import omitProps from './omitProps';

export default compose(
  withState('show', 'setShow', false),
  lifecycle({
    componentDidMount() {
      this.timer = setTimeout(() => this.props.setShow(T), 0);
    },
    componentWillUnmount() {
      clearTimeout(this.timer);
    },
  }),
  branch(
    props => !props.show,
    renderNothing,
    identity,
  ),
  omitProps(['show', 'setShow']),
);
