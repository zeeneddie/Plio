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
      return renderLoading();
    }

    if (errorWhenMissing) {
      return renderError(is(Function, errorWhenMissing ? errorWhenMissing() : errorWhenMissing));
    }
  }

  return is(Function, children) ? children(require) : children;
};

RenderSwitch.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  error: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  errorWhenMissing: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  renderError: PropTypes.func,
  renderLoading: PropTypes.func,
  require: PropTypes.any,
};

export default RenderSwitch;