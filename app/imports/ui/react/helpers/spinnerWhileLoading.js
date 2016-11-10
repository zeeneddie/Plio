import { _ } from 'meteor/underscore';
import { branch, renderComponent } from 'recompose';

const spinnerWhileLoading = (loading, loader) => branch(
  loading,
  renderComponent(loader),
  _.identity,
);

export default spinnerWhileLoading;
