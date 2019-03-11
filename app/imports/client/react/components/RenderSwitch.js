import PropTypes from 'prop-types';
import { is } from 'ramda';

import { handleGQError } from '../../../api/handleGQError';

const RenderSwitch = ({
  children,
  error,
  errorWhenMissing,
  loading,
  renderError = () => null,
  renderLoading = () => null,
  require,
}) => {
  if (error) return renderError(handleGQError(error));

  if (!require) {
    if (loading) {
      return is(Function, renderLoading) ? renderLoading() : renderLoading;
    }

    if (errorWhenMissing) {
      return renderError(errorWhenMissing());
    }
  }

  return is(Function, children) ? children(require) : children;
};

RenderSwitch.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  error: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  errorWhenMissing: PropTypes.func,
  renderError: PropTypes.func,
  renderLoading: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  require: PropTypes.any,
};

export default RenderSwitch;
