import { _ } from 'meteor/underscore';
import { branch, renderComponent } from 'recompose';

const spinnerWhileLoading = (hasLoaded, loader) => branch(
  hasLoaded,
  _.identity,
  renderComponent(loader),
);

export default spinnerWhileLoading;
