import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, FormGroup, Label, Col } from 'reactstrap';
import cx from 'classnames';
import { equals, prop, identity } from 'ramda';
import { branch, withStateHandlers } from 'recompose';

import { RadioButton } from './Buttons';
import CardBlock from './CardBlock';

const enhance = branch(
  prop('onChange'),
  identity,
  withStateHandlers(
    ({ active = 0 }) => ({ active }),
    {
      onChange: () => active => ({ active }),
    },
  ),
);

const renderButtons = ({ active, onChange, buttons }) => buttons.map((button, idx) => (
  <RadioButton
    key={`switch-view-button-${button.key}`}
    className={cx(equals(active, idx) && 'active')}
    onClick={() => onChange(idx)}
  >
    {button}
  </RadioButton>
));

const SwitchView = ({
  children,
  active,
  onChange,
  buttons,
}) => (
  <Fragment>
    <CardBlock>
      <FormGroup row>
        <Label sm="4" xs="12" />
        <Col sm="8" xs="12">
          <ButtonGroup className="btn-group-nomargin" data-toggle="buttons">
            {renderButtons({ active, onChange, buttons })}
          </ButtonGroup>
        </Col>
      </FormGroup>
    </CardBlock>
    {children[active]}
  </Fragment>
);

SwitchView.propTypes = {
  active: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  buttons: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
};

export default enhance(SwitchView);
