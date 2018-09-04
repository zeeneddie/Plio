import React from 'react';

import HeaderOptionsMenu from '/imports/client/react/components/HeaderOptionsMenu';
import DataExportModal from '/imports/client/react/data-export/components/DataExportModal';
import DropdownItem from 'reactstrap/lib/DropdownItem';

import { mapping } from '/imports/api/data-export/mapping/actions';
import { CollectionNames, ActionStatuses } from '/imports/share/constants';
import { withToggle } from '../../../helpers';

const dataExportProps = {
  docType: CollectionNames.ACTIONS,
  statuses: ActionStatuses,
  checkedFilters: mapping.defaultFilterIndexes,
  fields: Object.keys(mapping.fields).map(key => ({
    name: key,
    ...mapping.fields[key],
  })),
};

const enhance = withToggle();

const HeaderMenu = props => (
  <HeaderOptionsMenu {...props}>
    <DataExportModal title="Data export" {...dataExportProps}>
      <DropdownItem tag="a">Data export</DropdownItem>
    </DataExportModal>
  </HeaderOptionsMenu>
);


export default enhance(HeaderMenu);
