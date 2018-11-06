import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'reactstrap';

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
      component={EntityCard}
    >
      {({ handleSubmit }) => (
        <RiskEditForm
          {...{ organizationId, ...rest }}
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
  onDelete: PropTypes.func,
};

export default RiskSubcard;
