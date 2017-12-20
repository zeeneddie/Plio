import React, { PropTypes } from 'react';
import { withState } from 'recompose';
import { DropdownItem } from 'reactstrap';

import { FormField, SelectInput } from '../../../../../components';
import HomeScreenTitleAdd from '../HomeScreenTitleAdd';

const enhance = withState('value', 'setValue', '');

const HomeScreenTitle = enhance(({
  value, setValue, label, ...other
}) => (
  <FormField>
    <span>{label}</span>
    <SelectInput caret {...{ value, setValue, ...other }}>
      <DropdownItem divider />
      <HomeScreenTitleAdd {...{ value, setValue, ...other }} />
    </SelectInput>
  </FormField>
));

HomeScreenTitle.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

export default HomeScreenTitle;
