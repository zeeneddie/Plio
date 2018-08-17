import PropTypes from 'prop-types';
import React from 'react';
import { FormGroup, ButtonGroup } from 'reactstrap';

import Button from '../../../components/Buttons/Button';
import Icon from '../../../components/Icons/Icon';

const FormButtonList = ({ items, onDelete, children }) => (
  <FormGroup className="form-group-buttons no-margin">
    {items.map(({ text, ...item }) => (
      <ButtonGroup key={`${item.value}-${text}`}>
        <Button color="secondary" title={text} disabled>
          {text}
        </Button>
        {!!onDelete && (
          <Button
            color="secondary icon"
            onClick={e => onDelete({ text, ...item }, e)}
          >
            <Icon name="times-circle" />
          </Button>
        )}
      </ButtonGroup>
    ))}
    {children}
  </FormGroup>
);

FormButtonList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  onDelete: PropTypes.func,
  children: PropTypes.node,
};

export default FormButtonList;
