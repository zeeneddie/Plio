import PropTypes from 'prop-types';
import React from 'react';
import { withHandlers } from 'recompose';

import swal from '/imports/ui/utils/swal';
import { FormField, SelectInput } from '../../../../../components';
import { createWorkspaceTitleValue } from '../../../../helpers';

const enhance = withHandlers({
  onNewOptionClick: ({ id, onSelect }) => ({ value }, callback) => {
    if (!value) return;

    const addNewItem = () => {
      const newItem = {
        label: value,
        value: createWorkspaceTitleValue(id, value),
      };
      const showSuccessAlert = () =>
        swal.success('Added!', `Title "${value}" was added successfully.`);

      onSelect(newItem, (err) => {
        if (!err) {
          showSuccessAlert();
          if (callback) callback(newItem);
        }
      });
    };

    swal({
      title: 'Are you sure?',
      text: `New title "${value}" will replace the current one.`,
      confirmButtonText: 'Add',
      showCancelButton: true,
      type: 'warning',
    }, addNewItem);
  },
});

const HomeScreenTitle = enhance(({
  label,
  items,
  selected,
  onSelect,
  onNewOptionClick,
}) => (
  <FormField>
    <span>{label}</span>
    <SelectInput
      value={selected}
      options={items}
      onChange={onSelect}
      placeholder="Select a title..."
      type="creatable"
      promptTextCreator={selectedLabel => `Add "${selectedLabel}" title`}
      onNewOptionClick={onNewOptionClick}
    />
  </FormField>
));

HomeScreenTitle.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func.isRequired,
  onNewOptionClick: PropTypes.func,
};

export default HomeScreenTitle;
