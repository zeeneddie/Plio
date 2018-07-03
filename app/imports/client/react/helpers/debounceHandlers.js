import { createElement, Component } from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';
import debounce from 'lodash.debounce';

export default (handlerNames, delay, leadingCall) => (Target) => {
  class DebounceHandlers extends Component {
    constructor(props, context) {
      super(props, context);

      const handlers = handlerNames.reduce((acc, key) => ({
        ...acc,
        [key]: debounce(props[key], delay, leadingCall),
      }), {});

      handlerNames.forEach((key) => {
        this[key] = (e, ...rest) => {
          if (e && typeof e.persist === 'function') {
            e.persist();
          }

          return handlers[key](e, ...rest);
        };
      });
    }

    render() {
      return createElement(Target, {
        ...this.props,
        ...handlerNames.reduce((acc, key) => ({
          ...acc,
          [key]: this[key],
        }), {}),
      });
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(Target, 'debounceHandlers'))(DebounceHandlers);
  }

  return DebounceHandlers;
};
