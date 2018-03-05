import React from 'react';
import { WorkspaceDefaultsTypes } from '/imports/share/constants';
import CardBlockCollapse from '/imports/ui/react/components/CardBlockCollapse';
import LimitNumberField from './LimitNumberField';
import CardBlock from '../../components/CardBlock';

const fields = [
  {
    label: 'Number of key goals',
    valueKey: WorkspaceDefaultsTypes.DISPLAY_GOALS,
  },
  {
    label: 'Number of completed & deleted goals',
    valueKey: WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS,
  },
];

const KeyGoalsSettings = props => (
  <CardBlockCollapse leftText="Key goals">
    <CardBlock>
      {fields.map(field => (
        <LimitNumberField key={field.valueKey} {...field} {...props} />
      ))}
    </CardBlock>
  </CardBlockCollapse>
);

export default KeyGoalsSettings;
