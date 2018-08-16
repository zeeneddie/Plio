import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { is } from 'ramda';

import EntityModalBase from './EntityModalBase';
import EntityModalForm from './EntityModalForm';
import EntityModalBody from './EntityModalBody';
import EntityModalHeader from './EntityModalHeader';
import { WithToggle } from '../../helpers';

const EntityModal = ({
  isOpen,
  toggle,
  isEditMode,
  label,
  loading,
  error,
  guidance,
  onDelete,
  children,
  onClosed,
  onOpened,
  onEnter,
  onExit,
  renderModal: Modal,
  renderHeader: Header,
  renderBody: Body,
  ...props
}) => (
  <Modal
    {...{
      isOpen,
      toggle,
      onOpened,
      onClosed,
      onEnter,
      onExit,
    }}
  >
    <EntityModalForm {...props}>
      {form => (
        <WithToggle>
          {guidanceState => (
            <Fragment>
              <Header
                {...{
                  label,
                  isEditMode,
                  loading,
                  error,
                  toggle,
                }}
                isGuidanceOpen={guidanceState.isOpen}
                toggleGuidance={guidanceState.toggle}
              />
              <Body
                {...{
                  guidance,
                  onDelete,
                  loading,
                  error,
                }}
                isGuidanceOpen={guidanceState.isOpen}
                toggleGuidance={guidanceState.toggle}
              >
                {is(Function, children) ? children({ form }) : children}
              </Body>
            </Fragment>
          )}
        </WithToggle>
      )}
    </EntityModalForm>
  </Modal>
);

EntityModal.defaultProps = {
  renderModal: EntityModalBase,
  renderHeader: EntityModalHeader,
  renderBody: EntityModalBody,
};

EntityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  guidance: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onDelete: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  onClosed: PropTypes.func,
  onOpened: PropTypes.func,
  onEnter: PropTypes.func,
  onExit: PropTypes.func,
  renderModal: PropTypes.func,
  renderHeader: PropTypes.func,
  renderBody: PropTypes.func,
};

export default EntityModal;
