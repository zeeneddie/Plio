import React, { PropTypes } from 'react';
import { FormGroup, ButtonGroup } from 'reactstrap';

import Button from '../../../components/Buttons/Button';
import Icon from '../../../components/Icons/Icon';

const FormButtonList = ({ selectedItems, onDelete, children }) => (
  <FormGroup className="form-group-buttons no-margin">
    {selectedItems.map(({ text, ...item }, i) => (
      <ButtonGroup key={i}>
        <Button color="secondary" title={text} disabled>
          {text}
        </Button>
        {!!onDelete && (
          <Button
            color="secondary icon"
            onClick={e => onDelete(e, { text, ...item })}
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
  selectedItems: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  onDelete: PropTypes.func,
  children: PropTypes.node,
};

export default FormButtonList;
