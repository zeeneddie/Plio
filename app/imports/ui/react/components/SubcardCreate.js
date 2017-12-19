import React, { PropTypes } from 'react';
import { CardBlock, ButtonGroup, FormGroup } from 'reactstrap';
import cx from 'classnames';
import { pluck, propOr, map, equals } from 'ramda';
import { withState } from 'recompose';

import RadioButton from './Buttons/RadioButton';

const buttons = [
  { contents: 'New', id: 1 },
  { contents: 'Existing', id: 2 },
];
const renderButtons = active => map(({ contents, id }) => (
  <RadioButton key={id} className={cx(equals(active, id) && 'active')}>
    {contents}
  </RadioButton>
), buttons);
const enhance = withState('active', 'setActive', propOr(buttons[0].id, 'active'));

const CreateSubcard = enhance(({ active }) => (
  <CardBlock>
    <FormGroup className="row">
      <label className="form-control-label col-sm-4 col-xs-12" />
      <div className="col-sm-8 col-xs-12">
        <ButtonGroup className="btn-group-nomargin" data-toggle="buttons">
          {renderButtons(active)}
        </ButtonGroup>
      </div>
    </FormGroup>
    <hr />
  </CardBlock>
));

CreateSubcard.propTypes = {
  active: PropTypes.oneOf(pluck('id', buttons)),
};

export default CreateSubcard;
