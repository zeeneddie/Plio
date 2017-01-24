import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import curry from 'lodash.curry';

const withRedirectAndOpen = curry((predicate, connectHandle, handler) => compose(
  connect(connectHandle),
  lifecycle({
    componentWillMount() {
      handler(this.props);
    },
    componentWillReceiveProps(nextProps) {
      if (predicate(this.props, nextProps)) {
        handler(nextProps);
      }
    },
  })
));

export default withRedirectAndOpen;
