import React, { PropTypes } from 'react';
import { compose, withState, withHandlers, flattenProp } from 'recompose';

import OrgName from '../../fields/edit/components/OrgName';
import CustomerTypeSelectContainer from '../../fields/edit/containers/CustomerTypeSelectContainer';
import OrgDeleteContainer from '../../fields/edit/containers/OrgDeleteContainer';
import SelectSingle from '../../../forms/components/SelectSingle';
import FormField from '../../../fields/edit/components/FormField';
import FormButtonList from '../../../forms/components/FormButtonList';

const enhance = compose(
  withState('state', 'setState', {
    selected: 2,
    selectedItems: [{ text: 'Qwerty', value: 2 }],
    items: [
      { text: 'Hello World', value: 1 },
      { text: 'Qwerty', value: 2 },
      { text: 'Lorem ipsum', value: 3 },
    ],
  }),
  withHandlers({
    onSelect: ({ setState }) => (e, { value, ...item }) =>
      setState(state => ({
        ...state,
        selected: value,
        selectedItems: state.selectedItems.concat({ value, ...item }),
      })),
    onDelete: ({ setState }) => (e, { value }) =>
      setState(state => {
        const index = state.selectedItems.findIndex(item => item.value === value);
        return {
          ...state,
          selectedItems: state.selectedItems.slice(0, index)
            .concat(state.selectedItems.slice(index + 1)),
        };
      }),
  }),
  flattenProp('state'),
);

const ModalEdit = enhance(({
  organization = {},
  onSelect,
  selected,
  selectedItems,
  onDelete,
  items,
}) => (
  <div className="relative">
    <div className="card-block">
      <OrgName {...organization} />
      <CustomerTypeSelectContainer {...organization} />
      <FormField>
        <span>Test #1</span>
        <SelectSingle
          {...{ selected, onSelect, items }}
          placeholder="Placeholder"
        >
          <div className="dropdown-item">
            Hello World
          </div>
        </SelectSingle>
      </FormField>
      <FormField>
        <span>Test #2</span>
        <FormButtonList {...{ selectedItems, onDelete }}>
          <SelectSingle
            {...{ selected, onSelect, items }}
            placeholder="Placeholder"
          >
            <div className="dropdown-item">
              Hello World
            </div>
          </SelectSingle>
        </FormButtonList>
      </FormField>
    </div>
    <OrgDeleteContainer {...organization} />
  </div>
));

ModalEdit.propTypes = {
  organization: PropTypes.object.isRequired,
};

export default ModalEdit;
