import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';

import { Icon, Button } from '../../components';
import DatePickerField from './DatePickerField';

const DateArrayField = ({ name, ...props }) => (
  <FieldArray {...{ name }} subscription={{ value: 1 }}>
    {({ fields }) => (
      <Fragment>
        {fields.map((fieldName, index) => (
          <DatePickerField
            {...props}
            isClearable
            key={fieldName}
            name={`${fieldName}.date`}
            onDelete={() => fields.remove(index)}
          />
        ))}
        <Button onClick={() => fields.push({})}>
          <Icon name="plus" /> Add review date
        </Button>
      </Fragment>
    )}
  </FieldArray>
);

DateArrayField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default DateArrayField;
