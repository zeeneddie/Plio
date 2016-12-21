import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import { compose, withState, getContext } from 'recompose';

import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';

const enhance = compose(
  getContext({ changeField: PropTypes.func }),
  withState('isChecked', 'setIsChecked', props => !!props.checked),
);
const Checkbox = enhance(({ text, name, changeField, isChecked, setIsChecked }) => (
  <FormGroup check>
    <Label check>
      <Input
        name={name}
        type="checkbox"
        checked={isChecked}
        onChange={({ target: { value, checked } }) => {
          setIsChecked(checked);
          changeField(name, checked ? value : '');
        }}
      />
      {` ${text}`}
    </Label>
  </FormGroup>
));

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  setIsChecked: PropTypes.func,
  changeField: PropTypes.func,
};

export default Checkbox;
