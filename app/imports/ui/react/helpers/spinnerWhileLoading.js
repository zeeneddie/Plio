import React from 'react';
import { branch, renderComponent } from 'recompose';

import PreloaderPage from '../components/PreloaderPage';

const spinnerWhileLoading = hasLoaded => branch(
  hasLoaded,
  _.identity,
  renderComponent(PreloaderPage)
);

export default spinnerWhileLoading;
