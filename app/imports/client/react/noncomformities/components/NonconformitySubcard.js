import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import categorize from '../../forms/decorators/categorize';
import { validateNonConformity } from '../../../validation';
import {
  CardBlock,
  EntityForm,
  EntityCard,
} from '../../components';
import NonconformityEditForm from './NonconformityEditForm';

const NonconformitySubcard = ({
  nonconformity,
  isOpen,
  toggle,
  onDelete,
  onSubmit,
  organizationId,
  initialValues,
  refetchQueries,
  ...rest
}) => (
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
        <strong>{nonconformity.sequentialId}</strong>
        {' '}
        {nonconformity.title}
      </Fragment>
    )}
    decorators={[categorize]}
    validate={validateNonConformity}
    component={EntityCard}
  >
    {({ handleSubmit }) => (
      <CardBlock>
        <NonconformityEditForm
          {...{ organizationId, refetchQueries, ...rest }}
          nonconformityId={nonconformity._id}
          type={nonconformity.type}
          save={handleSubmit}
        />
      </CardBlock>
    )}
  </EntityForm>
);

NonconformitySubcard.propTypes = {
  nonconformity: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  refetchQueries: PropTypes.func,
};

export default NonconformitySubcard;
