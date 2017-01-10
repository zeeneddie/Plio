import React from 'react';
import { withState } from 'recompose';

import HeaderOptionsMenu from '/imports/ui/react/components/HeaderOptionsMenu';
import DataExportModal from '/imports/ui/react/data-export/components/DataExportModal';
import DropdownItem from 'reactstrap/lib/DropdownItem';

import { mapping } from '/imports/api/data-export/mapping/risks';
import { CollectionNames, ProblemsStatuses } from '/imports/share/constants';


const dataExportProps = {
  docType: CollectionNames.RISKS,
  statuses: ProblemsStatuses,
  fields: Object.keys(mapping.fields).map(key => ({
    name: key,
    ...mapping.fields[key],
  })),
};

const enhance = withState('isOpen', 'setIsOpen', false);
const HeaderMenu = (props) => (
  <HeaderOptionsMenu {...props}>
    <DataExportModal title="Data export" {...dataExportProps}>
      <DropdownItem tag="a">Export Data</DropdownItem>
    </DataExportModal>
  </HeaderOptionsMenu>
);

export default enhance(HeaderMenu);
