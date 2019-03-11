import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'reactstrap';

import categorize from '../../forms/decorators/categorize';
import { validateRisk } from '../../../validation';
import { EntityForm, EntityCard } from '../../components';
import RiskEditForm from './RiskEditForm';

const RiskSubcard = ({
  risk,
  isOpen,
  toggle,
  onDelete,
  onSubmit,
  organizationId,
  initialValues,
  refetchQueries,
  ...rest
}) => (
  <Card>
    <EntityForm
      {...{
        isOpen,
        toggle,
        onDelete,
        onSubmit,
        initialValues,
      }}
      label={(
        <Fragment>
          <strong>{risk.sequentialId}</strong>
          {' '}
          {risk.title}
        </Fragment>
      )}
      validate={validateRisk}
      decorators={[categorize]}
      component={EntityCard}
    >
      {({ handleSubmit }) => (
        <RiskEditForm
          {...{ organizationId, refetchQueries, ...rest }}
          riskId={risk._id}
          save={handleSubmit}
        />
      )}
    </EntityForm>
  </Card>
);

RiskSubcard.propTypes = {
  risk: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  refetchQueries: PropTypes.func,
  onDelete: PropTypes.func,
};

export default RiskSubcard;
