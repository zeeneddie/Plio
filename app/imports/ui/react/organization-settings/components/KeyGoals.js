import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle } from 'reactstrap';
import { withStateToggle } from '../../helpers';
import { WorkspaceDefaultsTypes, TimeScaleOptions } from '../../../../share/constants';
import { CardBlock, Subcard, SubcardHeader, SubcardBody } from '../../components';
import WorkspaceDefaultsField from './WorkspaceDefaultsField';

const enhance = withStateToggle(false, 'isOpen', 'toggle');
const KeyGoalsSettings = enhance(({
  isOpen,
  toggle,
  changeChartScale,
  changeGoalsLimit,
  changeCompletedDeletedGoals,
  ...restProps
}) => (
  <div>
    <Subcard {...{ isOpen, toggle }}>
      <SubcardHeader><CardTitle>Key goals</CardTitle></SubcardHeader>
      <SubcardBody>
        <CardBlock>
          <WorkspaceDefaultsField
            label="Horizontal scale"
            value={restProps[WorkspaceDefaultsTypes.TIME_SCALE]}
            valueKey={WorkspaceDefaultsTypes.TIME_SCALE}
            onChange={changeChartScale}
            options={TimeScaleOptions}
            sm="6"
          />

          <WorkspaceDefaultsField
            label="Number of key goals"
            value={restProps[WorkspaceDefaultsTypes.DISPLAY_GOALS]}
            valueKey={WorkspaceDefaultsTypes.DISPLAY_GOALS}
            onChange={changeGoalsLimit}
            sm="6"
          />

          <WorkspaceDefaultsField
            label="Number of completed & deleted goals"
            value={restProps[WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]}
            valueKey={WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS}
            onChange={changeCompletedDeletedGoals}
            sm="6"
          />
        </CardBlock>
      </SubcardBody>
    </Subcard>
  </div>
));

KeyGoalsSettings.propTypes = {
  changeChartScale: PropTypes.func.isRequired,
  changeGoalsLimit: PropTypes.func.isRequired,
  changeCompletedDeletedGoals: PropTypes.func.isRequired,
};

export default KeyGoalsSettings;
