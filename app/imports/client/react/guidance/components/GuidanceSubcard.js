import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'reactstrap';

import validateGuidance from '../../../validation/validators/validateGuidance';
import { EntityForm, EntityCard } from '../../components';
import GuidanceForm from './GuidanceForm';

const GuidanceSubcard = ({
  guidance,
  onSubmit,
  initialValues,
  isOpen,
  toggle,
  onDelete,
}) => (
  <Fragment>
    <Card>
      <EntityForm
        {...{
          isOpen,
          toggle,
          onDelete,
          onSubmit,
          initialValues,
        }}
        label={guidance.title}
        validate={validateGuidance}
        component={EntityCard}
      >
        {({ handleSubmit }) => (
          <GuidanceForm save={handleSubmit} />
        )}
      </EntityForm>
    </Card>
  </Fragment>
);

GuidanceSubcard.propTypes = {
  guidance: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default GuidanceSubcard;
