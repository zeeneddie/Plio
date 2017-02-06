import React, { PropTypes } from 'react';
import { compose, getContext, withProps, withState, withHandlers } from 'recompose';
import { FormGroup } from 'reactstrap';
import { Meteor } from 'meteor/meteor';

import { getId, transsoc } from '/imports/api/helpers';
import { getFullName } from '/imports/api/users/helpers';
import SelectInput from '../../../../forms/components/SelectInput';

const SelectInputEnhanced = withState('value', 'setValue', '')(SelectInput);

const enhance = compose(
  getContext({
    changeField: PropTypes.func,
    getField: PropTypes.func,
  }),
  withProps(() => ({
    selected: Meteor.userId(),
    items: Meteor.users.find().fetch().map(transsoc({
      value: getId,
      text: getFullName,
    })),
  })),
  withHandlers({
    onSelect: ({ changeField, fieldName }) => (e, { value }) => {
      if (value) changeField(fieldName, value);
    },
  }),
);

const ReviewReviewerSelect = enhance(({ value, setValue, selected, items, onSelect }) => (
  <FormGroup>
    <label className="form-control-label">
      Reviewer
    </label>
    <SelectInputEnhanced {...{ value, setValue, selected, items, onSelect }} />
  </FormGroup>
));

ReviewReviewerSelect.propTypes = {
  fieldName: PropTypes.string,
};

export default ReviewReviewerSelect;
