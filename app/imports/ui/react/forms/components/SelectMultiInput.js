import React, { PropTypes } from 'react';
import { compose, withState, withHandlers, mapProps } from 'recompose';
import { reject, unless, prop, propOr, append, equals } from 'ramda';

import SelectInput from './SelectInput';
import FormButtonList from './FormButtonList';
import { lenses, filterBy, rejectBy, viewOr } from '../../../../client/util';

const enhance = compose(
  withState('value', 'setValue', propOr('', 'value')),
  withState(
    'selected',
    'setSelected',
    viewOr([], lenses.selected),
  ),
  unless(
    prop('onDelete'),
    withHandlers({
      onDelete: ({ selected, setSelected }) => ({ value }) =>
        setSelected(reject(equals(value), selected)),
    }),
  ),
  unless(
    prop('onSelect'),
    withHandlers({
      onSelect: ({ selected, setSelected, setValue }) => (_, { value }, cb) => {
        setValue('');
        setSelected(append(value, selected), cb);
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
  onChange,
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

};

export default SelectMultiInput;
