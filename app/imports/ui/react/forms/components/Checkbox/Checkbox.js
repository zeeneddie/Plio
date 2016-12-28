import React, { PropTypes } from 'react';
import cx from 'classnames';
import { compose, withState, getContext } from 'recompose';

import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';
import Button from 'reactstrap/lib/Button';
import Icon from '/imports/ui/react/components/Icon';

const enhance = compose(
  getContext({ changeField: PropTypes.func }),
  withState('isChecked', 'setIsChecked', props => !!props.checked),
);
const Checkbox = enhance(({ text, name, changeField, isChecked, setIsChecked }) => (
  <FormGroup check>
    <Label check>
      <Button
        color="secondary"
        className={cx('btn-checkbox', { active: isChecked })}
        onClick={(e) => {
          e.preventDefault();
          setIsChecked(!isChecked);
          changeField(name, !isChecked ? 'on' : '');
        }}
      >
        <Icon name="check" className={cx({ invisible: !isChecked })} />
      </Button>
      <Input
        readOnly
        name={name}
        type="checkbox"
        checked={isChecked}
        className="hidden"
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
