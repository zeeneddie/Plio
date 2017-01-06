import React, { PropTypes } from 'react';
import { withState } from 'recompose';
import { DropdownItem } from 'reactstrap';

import FormField from '../../../../../fields/edit/components/FormField';
import SelectSingle from '../../../../../forms/components/SelectSingle';
import DropdownItemAdd from '../../../../../components/DropdownItemAdd';

const enhance = withState('value', 'setValue', '');

const HomeScreenTitle = enhance(({ value, setValue, label, ...other }) => (
  <FormField>
    <span>{label}</span>
    <SelectSingle isControlled {...{ value, setValue, ...other }}>
      <DropdownItem divider />
      <DropdownItemAdd tag="span">
        {!!value && `Add "${value}" title`}
      </DropdownItemAdd>
    </SelectSingle>
  </FormField>
));

HomeScreenTitle.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

export default HomeScreenTitle;
