import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle } from 'reactstrap';
import { withStateToggle } from '../../helpers';
import { WorkspaceDefaultsTypes, TimeScaleOptions } from '../../../../share/constants';
import { CardBlock, Subcard, SubcardHeader, SubcardBody } from '../../components';
import WorkspaceDefaultsField from './WorkspaceDefaultsField';

const enhance = withStateToggle(false, 'isOpen', 'toggle');
const KeyGoalsSettings = enhance(({
  changeWorkspaceDefaults,
  isOpen,
  toggle,
  ...restProps
}) => (
  <Subcard {...{ isOpen, toggle }}>
    <SubcardHeader><CardTitle>Key goals</CardTitle></SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <WorkspaceDefaultsField
          label="Horizontal scale"
          value={restProps[WorkspaceDefaultsTypes.TIME_SCALE]}
          valueKey={WorkspaceDefaultsTypes.TIME_SCALE}
          onChange={changeWorkspaceDefaults}
          options={TimeScaleOptions}
          sm="6"
        />

        <WorkspaceDefaultsField
          label="Number of key goals"
          value={restProps[WorkspaceDefaultsTypes.DISPLAY_GOALS]}
          valueKey={WorkspaceDefaultsTypes.DISPLAY_GOALS}
          onChange={changeWorkspaceDefaults}
          sm="6"
        />

        <WorkspaceDefaultsField
          label="Number of completed & deleted goals"
          value={restProps[WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]}
          valueKey={WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS}
          onChange={changeWorkspaceDefaults}
          sm="6"
        />
      </CardBlock>
    </SubcardBody>
  </Subcard>
));

KeyGoalsSettings.propTypes = {
  changeWorkspaceDefaults: PropTypes.func.isRequired,
};

export default KeyGoalsSettings;
