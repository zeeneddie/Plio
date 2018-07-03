import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Button } from 'reactstrap';

import { withToggle } from '../helpers';
import StyledFlexFormGroup from './styled/StyledFlexFormGroup';

const enhance = withToggle();

const ToggleComplete = ({
  isOpen,
  toggle,
  children,
  input = null,
  completeButtonContent = 'Complete',
  ...props
}) => (
  <Fragment>
    <StyledFlexFormGroup {...{ ...props, input }}>
      {input}
      {isOpen ? (
        <Button color="link" onClick={toggle}>Cancel</Button>
      ) : (
        <Button color="success" onClick={toggle}>
          {completeButtonContent}
        </Button>
      )}
    </StyledFlexFormGroup>

    {isOpen && children}
  </Fragment>
);

ToggleComplete.propTypes = {
  input: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  completeButtonContent: PropTypes.node,
  children: PropTypes.node,
};

export default enhance(ToggleComplete);
