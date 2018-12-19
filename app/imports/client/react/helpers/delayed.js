import React, { createElement as h } from 'react';
import { noop } from 'plio-util';

const mock = ({ loading = null } = {}) => {
  let Comp;
  let cnt = 0;
  const instances = {};

  const Mock = class Mock extends React.Component {
    constructor(props, context) {
      super(props, context);

      instances[this.mockId] = this;
    }

    componentWillUnmount() {
      delete instances[this.mockId];
    }

    mockId = cnt++; // eslint-disable-line no-plusplus

    render() {
      if (Comp) {
        return h(Comp, this.props);
      }
      return typeof loading === 'function' ? h(loading, this.props) : loading;
    }
  };

  Mock.implement = (Implementation) => {
    Comp = Implementation;

    /* eslint-disable */
    for (const id in instances) {
      instances[id].forceUpdate();
    }
    /* eslint-disable */
  };

  return Mock;
};

const loadable = (params) => {
  const { loader } = params;
  const Mock = mock(params);

  Mock.load = () => {
    loader().then((Implementation) => {
      Mock.implement((Implementation).default || Implementation);
    }, (error) => {
      const element = params.error ? params.error(error) : null;
      Mock.implement(element || null);
    });
    Mock.load = noop;
  };

  return Mock;
};

const lazy = (params) => {
  const Loadable = loadable(params);

  let needsLoading = true;
  const Lazy = ((props) => {
    if (needsLoading) {
      needsLoading = false;
      Loadable.load();
    }

    return h(Loadable, props);
  });

  Lazy.load = Loadable.load;

  return Lazy;
};

const wait = (loader, delay) => new Promise(resolve => setTimeout(() => resolve(loader()), delay));
const RIC = window.requestIdleCallback || (callback => setTimeout(callback, 300));
const PRIC = loader => new Promise(resolve => RIC(() => resolve(loader())));
const RAF = requestAnimationFrame;
const PRAF = value => new Promise(resolve => RAF(() => resolve(value)));

export default (params) => {
  const {
    delay,
    draf,
    idle,
  } = params;

  /* eslint-disable no-param-reassign */
  if (delay) {
    const { loader } = params;
    params.loader = () => wait(loader, delay);
  }

  if (idle) {
    const { loader } = params;
    params.loader = () => PRIC(loader);
  }

  if (draf) {
    const { loader } = params;
    params.loader = () => loader().then(PRAF).then(PRAF);
  }
  /* eslint-disable no-param-reassign */

  return lazy(params);
};
