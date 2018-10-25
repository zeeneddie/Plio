import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'reactstrap';
import styled from 'styled-components';
import { Field } from 'react-final-form';

import { getFormattedDate } from '../../../../share/helpers';
import { EntityForm, EntityCard } from '../../components';
import { validateMilestone } from '../../../validation';
import MilestoneSymbol from './MilestoneSymbol';
import MilestoneForm from './MilestoneForm';

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  & > div:nth-child(2) {
    display: flex;
    align-items: center;
    & > div:nth-child(1) {
      margin-right: 10px;
    }
  }
`;

const MilestoneSubcard = ({
  milestone,
  isOpen,
  toggle,
  onDelete,
  initialValues,
  onSubmit,
}) => (
  <Card>
    <EntityForm
      {...{
        isOpen,
        toggle,
        onDelete,
        initialValues,
        onSubmit,
      }}
      label={(
        <StyledHeader>
          <div>{milestone.title}</div>
          <div className="hidden-xs-down">
            <div>
              {getFormattedDate(milestone.completionTargetDate)}
            </div>
            <Field name="color" subscription={{ value: true }}>
              {({ input: { value: color } }) => (
                <MilestoneSymbol status={milestone.status} {...{ color }} />
              )}
            </Field>
          </div>
        </StyledHeader>
      )}
      validate={validateMilestone}
      component={EntityCard}
    >
      {({ handleSubmit }) => (
        <MilestoneForm save={handleSubmit} />
      )}
    </EntityForm>
  </Card>
);

MilestoneSubcard.propTypes = {
  milestone: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default MilestoneSubcard;
