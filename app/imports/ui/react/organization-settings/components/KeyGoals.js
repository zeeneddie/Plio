import React from 'react';
import PropTypes from 'prop-types';
import CardBlockCollapse from '/imports/ui/react/components/CardBlockCollapse';
import LimitNumberField from './LimitNumberField';
import { WorkspaceDefaultsTypes, TimeScaleOptions } from '../../../../share/constants';
import { SelectInput } from '../../forms/components';
import { FormField, CardBlock } from '../../components';

const KeyGoalsSettings = ({ changeWorkspaceDefaults, ...restProps }) => (
  <CardBlockCollapse leftText="Key goals">
    <CardBlock>
      <FormField sm="6">
        Horizontal scale
        <SelectInput
          value={restProps[WorkspaceDefaultsTypes.TIME_SCALE]}
          options={TimeScaleOptions}
          onChange={({ value }) =>
            changeWorkspaceDefaults({ [WorkspaceDefaultsTypes.TIME_SCALE]: value })}
        />
      </FormField>

      <FormField sm="6">
        Number of key goals
        <LimitNumberField
          value={restProps[WorkspaceDefaultsTypes.DISPLAY_GOALS]}
          valueKey={WorkspaceDefaultsTypes.DISPLAY_GOALS}
          {...{ changeWorkspaceDefaults }}
        />
      </FormField>

      <FormField sm="6">
        Number of completed & deleted goals
        <LimitNumberField
          value={restProps[WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]}
          valueKey={WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS}
          {...{ changeWorkspaceDefaults }}
        />
      </FormField>
    </CardBlock>
  </CardBlockCollapse>
);

KeyGoalsSettings.propTypes = {
  changeWorkspaceDefaults: PropTypes.func.isRequired,
};

export default KeyGoalsSettings;
