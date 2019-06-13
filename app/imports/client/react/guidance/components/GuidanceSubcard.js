import React from 'react';
import PropTypes from 'prop-types';

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
