import { Tracker } from 'meteor/tracker';
import { compose } from '@storybook/react-komposer';

function getTrackerLoader(loaderFunc) {
  return (props, onData, env) => {
    let trackerCleanup = () => null;

    const handler = Tracker.nonreactive(() =>
      Tracker.autorun(() => {
        // Store clean-up function if provided.
        trackerCleanup = loaderFunc(props, onData, env) || (() => null);
      }));

    return () => {
      trackerCleanup();
      return handler.stop();
    };
  };
}

function composeWithTracker(loadFunc, options) {
  return function (component) {
    // explicitly pass { withRef: false }
    // otherwise react will throw error
    // that the component tries to access
    // a ref of the stateless component
    const opts = Object.assign({ withRef: false }, options);

    return compose(getTrackerLoader(loadFunc), opts)(component);
  };
}

export default composeWithTracker;
