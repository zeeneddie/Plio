import { withState, lifecycle } from 'recompose';

import namedCompose from './namedCompose';

export default interval => namedCompose('withCurrentTime')(
  withState('currentTime', 'setCurrentTime', () => new Date()),
  lifecycle({
    componentDidMount() {
      this.interval = setInterval(() => {
        this.props.setCurrentTime(new Date());
      }, interval || 1000);
    },
    componentWillUnmount() {
      clearInterval(this.interval);
    },
  }),
);
