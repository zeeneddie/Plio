import React, { PropTypes } from 'react';
import { compose, withState, withHandlers, mapProps } from 'recompose';
import { reject, unless, prop, propOr, append, equals } from 'ramda';

import SelectInput from './SelectInput';
import FormButtonList from './FormButtonList';
import { filterBy, rejectBy } from '../../../../client/util';

const enhance = compose(
  withState('value', 'setValue', propOr('', 'value')),
  unless(
    prop('onDelete'),
    withHandlers({
      onDelete: ({
        selected,
        setSelected,
        onChange,
        ...props
      }) => ({ value, ...item }) => {
        const nextSelected = reject(equals(value), selected);
        onChange({ selected: nextSelected, ...props }, { value, ...item });
      },
    }),
  ),
  unless(
    prop('onSelect'),
    withHandlers({
      onSelect: ({
        selected,
        setValue,
        onChange,
        ...props
      }) => (_, { value, ...item }, cb) => {
        const nextSelected = append(value, selected);
        setValue('');
        onChange({ selected: nextSelected, ...props }, { value, ...item });
        cb();
      },
    }),
  ),
  mapProps(({ items, selected, ...props }) => ({
    ...props,
    selected,
    items: rejectBy('value', selected, items),
    selectedItems: filterBy('value', selected, items),
  })),
);

const SelectMultiInput = enhance(({
  items,
  selectedItems,
  selected,
  onSelect,
  onDelete,
  value,
  setValue,
  ...props
}) => (
  <FormButtonList
    items={selectedItems}
    {...{ onDelete }}
  >
    <SelectInput
      caret
      hint
      // eslint-disable-next-line react/jsx-curly-brace-presence
      selected={''}
      {...{
        ...props,
        items,
        onSelect,
        value,
        setValue,
      }}
    />
  </FormButtonList>
));

SelectMultiInput.propTypes = {
  // eslint-disable-next-line react/no-typos
  items: SelectInput.propTypes.items,
  onChange: PropTypes.func.isRequired,
};

export default SelectMultiInput;
