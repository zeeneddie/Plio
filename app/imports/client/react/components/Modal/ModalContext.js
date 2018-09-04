import PropTypes from 'prop-types';
import React, { Component, createContext } from 'react';
import { handleGQError } from '../../../../api/handleGQError';

const { Provider, Consumer } = createContext({});

export const ModalConsumer = Consumer;

export class ModalProvider extends Component {
  state = {
    loading: false,
    error: null,
    handleMutation: this.handleMutation.bind(this),
    reset: this.reset.bind(this),
  };

  static get defaultProps() {
    return {
      formatMutationError: handleGQError,
    };
  }

  static get propTypes() {
    return {
      children: PropTypes.node,
      isOpen: PropTypes.bool.isRequired,
      toggle: PropTypes.func.isRequired,
      formatMutationError: PropTypes.func,
      onError: PropTypes.func,
    };
  }

  async handleMutation(promise) {
    this.setState({ loading: true });

    try {
      const res = await promise;

      this.setState({ loading: false, error: null });

      return res;
    } catch (err) {
      const { formatMutationError, onError } = this.props;
      const error = formatMutationError ? formatMutationError(err) : err;

      this.setState({ loading: false, error });

      if (onError) return onError(err);

      throw err;
    }
  }

  reset() {
    this.setState({ loading: false, error: null });
  }

  render() {
    const { isOpen, toggle, children } = this.props;

    return (
      <Provider value={{ ...this.state, isOpen, toggle }}>
        {children}
      </Provider>
    );
  }
}
