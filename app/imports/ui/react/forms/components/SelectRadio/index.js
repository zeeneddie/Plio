import React, { PropTypes } from 'react';
import { ButtonGroup, Input } from 'reactstrap';
import cx from 'classnames';

import Button from '../../../components/Buttons/Button';

const SelectRadio = ({ items, onSelect, selected }) => (
  <ButtonGroup className="btn-group-nomargin" data-toggle="buttons">
    {items.map(({ text, value, ...item }, i) => (
      <Button
        key={i}
        color="secondary"
        component="label"
        onClick={e => onSelect(e, { text, value, ...item })}
        className={cx({ active: selected === value })}
      >
        <Input type="radio" autoComplete="off" {...{ value }} />
        <span>{text}</span>
      </Button>
    ))}
  </ButtonGroup>
);

SelectRadio.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default SelectRadio;
