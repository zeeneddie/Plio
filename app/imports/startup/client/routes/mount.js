import { withOptions } from 'react-mounter';
import { mounter } from 'react-mounter/dist/client';

function mount(layoutClass, regions, options = {}) {
  const additionalOptions = {
    rootId: regions && regions.rootId || options.rootId || 'react-root',
    rootProps: options.rootProps || {},
  };

  mounter(layoutClass, regions, { ...options, ...additionalOptions });
}

export default withOptions({
  rootId: 'app',
}, mount);
