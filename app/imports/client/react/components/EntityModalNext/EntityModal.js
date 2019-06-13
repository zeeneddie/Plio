import PropTypes from 'prop-types';
import React, { Component, createContext } from 'react';
import { omit, keys } from 'ramda';

import { renderComponent } from '../../helpers';
import { Modal, ModalProvider } from '../Modal';

const { Provider, Consumer } = createContext({});

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  noForm: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  guidance: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onDelete: PropTypes.func,
  component: PropTypes.func,
  render: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  onClosed: PropTypes.func,
};

const omitProps = omit([...keys(propTypes), ...keys(Modal.propTypes)]);

export { Consumer };

export default class EntityModal extends Component {
  static propTypes = propTypes

  static defaultProps = {
    error: '',
  }

  state = { isGuidanceOpen: false }

  onClosed = () => {
    const { onClosed } = this.props;
    this.setState({ isGuidanceOpen: false });
    if (onClosed) onClosed();
  }

  toggleGuidance = () => {
    this.setState({ isGuidanceOpen: !this.state.isGuidanceOpen });
  }

  render() {
    const {
      isOpen,
      toggle,
      loading,
      error,
      isEditMode,
      onDelete,
      component,
      render,
      children,
      guidance,
      noForm,
      ...rest
    } = this.props;
    const state = { ...this.state };

    const value = {
      state,
      toggleGuidance: this.toggleGuidance,
      isOpen,
      toggle,
      loading,
      error,
      isEditMode,
      onDelete,
      guidance,
      noForm,
    };

    return (
      <ModalProvider
        {...{ isOpen, toggle }}
      >
        <Modal
          {...rest}
          onClosed={this.onClosed}
        >
          <Provider {...{ value }}>
            {renderComponent({
              ...omitProps(rest),
              ...state,
              toggleGuidance: this.toggleGuidance,
              component,
              render,
              children,
            })}
          </Provider>
        </Modal>
      </ModalProvider>
    );
  }
}
