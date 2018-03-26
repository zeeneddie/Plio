import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormGroup, Button } from 'reactstrap';
import styled from 'styled-components';

import { withToggle, omitProps } from '../helpers';

const StyledFormGroup = styled(omitProps(['content'])(FormGroup))`
  margin: 0;
  display: flex;
  & > button {
    margin-left: ${({ content }) => content ? '15px' : '0'}
  }
`;

const enhance = withToggle();

const ToggleComplete = ({
  isOpen,
  toggle,
  children,
  completeButtonContent = 'Complete',
  cancelButtonContent = 'Cancel',
  onComplete,
  content,
  button = (
    <Button
      color="success"
      onClick={isOpen ? onComplete : toggle}
    >
      {completeButtonContent}
    </Button>
  ),
  cancelButton = (
    <Button color="link" onClick={toggle}>{cancelButtonContent}</Button>
  ),
  ...props
}) => (
  <div {...props}>
    <StyledFormGroup {...{ content }}>
      {content}
      {isOpen ? cancelButton : button}
    </StyledFormGroup>

    {isOpen && (
      <Fragment>
        {children}
        {button}
      </Fragment>
    )}
  </div>
);

ToggleComplete.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  button: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  cancelButton: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  completeButtonContent: PropTypes.node,
  cancelButtonContent: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  onComplete: PropTypes.func,
};

export default enhance(ToggleComplete);
