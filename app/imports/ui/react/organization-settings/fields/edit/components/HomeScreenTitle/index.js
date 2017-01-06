import React, { PropTypes } from 'react';
import { withState } from 'recompose';
import { DropdownItem } from 'reactstrap';

import FormField from '../../../../../fields/edit/components/FormField';
import SelectSingle from '../../../../../forms/components/SelectSingle';
import HomeScreenTitleAdd from '../HomeScreenTitleAdd';

const enhance = withState('value', 'setValue', '');

const HomeScreenTitle = enhance(({ value, setValue, label, ...other }) => (
  <FormField>
    <span>{label}</span>
    <SelectSingle isControlled {...{ value, setValue, ...other }}>
      <DropdownItem divider />
      <HomeScreenTitleAdd {...{ value, setValue, ...other }} />
    </SelectSingle>
  </FormField>
));

HomeScreenTitle.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

export default HomeScreenTitle;
