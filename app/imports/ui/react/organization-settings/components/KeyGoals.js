import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { CardTitle } from 'reactstrap';
import { Form } from 'react-final-form';
import { noop, generateWorkspaceDefaultsOptions } from 'plio-util';

import {
  WorkspaceDefaultsTypes,
  TimeScaleOptions,
  WorkspaceDefaultsLabels,
} from '../../../../share/constants';
import {
  CardBlock,
  Subcard,
  SubcardHeader,
  SubcardBody,
  FormField,
  SelectInputField,
} from '../../components';

const KeyGoalsSettings = ({
  changeChartScale,
  changeGoalsLimit,
  changeCompletedDeletedGoals,
  initialValues,
}) => (
  <div>
    <Subcard>
      <SubcardHeader>
        <CardTitle>Key goals</CardTitle>
      </SubcardHeader>
      <SubcardBody>
        <CardBlock>
          <Form
            onSubmit={noop}
            subscription={{}}
            {...{ initialValues }}
          >
            {() => (
              <Fragment>
                <FormField sm={6}>
                  {WorkspaceDefaultsLabels[WorkspaceDefaultsTypes.TIME_SCALE]}
                  <SelectInputField
                    name={WorkspaceDefaultsTypes.TIME_SCALE}
                    options={TimeScaleOptions}
                    onChange={changeChartScale}
                  />
                </FormField>
                <FormField sm={6}>
                  {WorkspaceDefaultsLabels[WorkspaceDefaultsTypes.DISPLAY_GOALS]}
                  <SelectInputField
                    name={WorkspaceDefaultsTypes.DISPLAY_GOALS}
                    options={generateWorkspaceDefaultsOptions()}
                    onChange={changeGoalsLimit}
                  />
                </FormField>
                <FormField sm={6}>
                  {WorkspaceDefaultsLabels[WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]}
                  <SelectInputField
                    name={WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS}
                    options={generateWorkspaceDefaultsOptions()}
                    onChange={changeCompletedDeletedGoals}
                  />
                </FormField>
              </Fragment>
            )}
          </Form>
        </CardBlock>
      </SubcardBody>
    </Subcard>
  </div>
);

KeyGoalsSettings.propTypes = {
  changeChartScale: PropTypes.func.isRequired,
  changeGoalsLimit: PropTypes.func.isRequired,
  changeCompletedDeletedGoals: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};

export default KeyGoalsSettings;
