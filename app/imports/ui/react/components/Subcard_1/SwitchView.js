import React from 'react';
import PropTypes from 'prop-types';
import { CardBody, ButtonGroup, FormGroup } from 'reactstrap';
import cx from 'classnames';
import { equals } from 'ramda';

import RadioButton from '../Buttons/RadioButton';

const renderButtons = ({ active, onChange, buttons }) => buttons.map((button, idx) => (
  <RadioButton
    // eslint-disable-next-line react/no-array-index-key
    key={idx}
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
  <div>
    <CardBody className="card-block">
      <FormGroup className="row">
        <label className="form-control-label col-sm-4 col-xs-12" />
        <div className="col-sm-8 col-xs-12">
          <ButtonGroup className="btn-group-nomargin" data-toggle="buttons">
            {renderButtons({ active, onChange, buttons })}
          </ButtonGroup>
        </div>
      </FormGroup>
    </CardBody>
    {children[active]}
  </div>
);

SwitchView.propTypes = {
  active: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  buttons: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
};

export default SwitchView;
