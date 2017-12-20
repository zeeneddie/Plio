import React, { PropTypes } from 'react';
import { CardBlock, ButtonGroup, FormGroup } from 'reactstrap';
import { withState } from 'recompose';
import cx from 'classnames';
import { equals, propOr } from 'ramda';

import RadioButton from '../Buttons/RadioButton';

const ACTIVE = 'active';
const enhance = withState(ACTIVE, 'setActive', propOr(0, ACTIVE));
const renderButtons = ({ active, setActive, buttons }) => buttons.map((button, idx) => (
  <RadioButton
    // eslint-disable-next-line react/no-array-index-key
    key={idx}
    className={cx(equals(active, idx) && ACTIVE)}
    onClick={() => setActive(idx)}
  >
    {button}
  </RadioButton>
));

const SwitchView = enhance(({
  children,
  active,
  setActive,
  buttons,
}) => (
  <div>
    <CardBlock>
      <FormGroup className="row">
        <label className="form-control-label col-sm-4 col-xs-12" />
        <div className="col-sm-8 col-xs-12">
          <ButtonGroup className="btn-group-nomargin" data-toggle="buttons">
            {renderButtons({ active, setActive, buttons })}
          </ButtonGroup>
        </div>
      </FormGroup>
    </CardBlock>
    <CardBlock>
      {children[active]}
    </CardBlock>
  </div>
));

SwitchView.propTypes = {
  active: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  buttons: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
};

export default SwitchView;
