import PropTypes from 'prop-types';
import React from 'react';
import { FormGroup, Label, Col } from 'reactstrap';
import { branch } from 'recompose';
import { prop, identity } from 'ramda';
import styled from 'styled-components';

import { withStateToggle } from '../../../helpers';
import FormLabel from '../Form/FormLabel';
import GuidancePanel from '../../../components/GuidancePanel';
import GuidanceIcon from '../../../components/GuidanceIcon';

const StyledGuidanceIcon = styled(GuidanceIcon)`
  float: left;
  margin: -2px 6px 0 0;
  width: auto;
`;

const StyledGuidancePanel = styled(GuidancePanel)`
  & > .card-block {
    padding: 12px 0 0 0;
  }
`;

const enhance = branch(
  prop('guidance'),
  withStateToggle(false, 'isOpen', 'toggle'),
  identity,
);

const FormField = ({
  xs = 12,
  sm = 8,
  children,
  guidance,
  isOpen,
  toggle,
  ...props
}) => (
  <FormGroup row {...props}>
    <FormLabel sm={xs - sm} {...{ xs }}>
      {guidance && (<StyledGuidanceIcon onClick={toggle} />)}
      {children[0]}
    </FormLabel>
    <Col {...{ xs, sm }}>
      {children.slice(1)}

      {guidance && (
        <StyledGuidancePanel {...{ isOpen, toggle }}>
          {guidance}
        </StyledGuidancePanel>
      )}
    </Col>
  </FormGroup>
);

FormField.propTypes = {
  /* eslint-disable react/no-typos */
  xs: Label.propTypes.xs,
  sm: Label.propTypes.sm,
  /* eslint-enable react/no-typos */
  guidance: PropTypes.node,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  children: PropTypes.node,
};

export default enhance(FormField);
