import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormGroup, Button } from 'reactstrap';

const ToggleComplete = ({
  isOpen,
  toggle,
  children,
  completeButtonContent = 'Complete',
  cancelButtonContent = 'Cancel',
  onComplete,
  renderButton = () => (
    <Button
      color="success"
      onClick={isOpen ? onComplete : toggle}
    >
      {completeButtonContent}
    </Button>
  ),
  renderCancelButton = () => (
    <Button color="link" onClick={toggle}>{cancelButtonContent}</Button>
  ),
  render = () => null,
  ...props
}) => (
  <div {...props}>
    <FormGroup className="no-margin">
      {render({ isOpen, toggle })}
      {isOpen ? renderCancelButton({ isOpen, toggle }) : renderButton({ isOpen, toggle })}
    </FormGroup>

    {isOpen && (
      <Fragment>
        {children}
        {renderButton({ isOpen, toggle })}
      </Fragment>
    )}
  </div>
);

ToggleComplete.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  renderButton: PropTypes.func,
  renderCancelButton: PropTypes.func,
  render: PropTypes.func,
  completeButtonContent: PropTypes.node,
  cancelButtonContent: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
};

export default ToggleComplete;
