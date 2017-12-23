import { Tracker } from 'meteor/tracker';
import { compose } from 'ramda';

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

function composeWithTracker(loadFunc) {
  return function (component) {
    return compose(getTrackerLoader(loadFunc))(component);
  };
}

export default composeWithTracker;
