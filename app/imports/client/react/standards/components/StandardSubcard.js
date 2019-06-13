import React from 'react';
import PropTypes from 'prop-types';

import { validateStandardUpdate } from '../../../validation';
import categorize from '../../forms/decorators/categorize';
import shouldRenderSource2 from '../../forms/decorators/shouldRenderSource2';
import {
  CardBlock,
  EntityForm,
  EntityCard,
} from '../../components';
import StandardEditForm from './StandardEditForm';

const StandardSubcard = ({
  standard,
  isOpen,
  toggle,
  onDelete,
  onSubmit,
  organizationId,
  initialValues,
}) => (
  <EntityForm
    {...{
      isOpen,
      toggle,
      onDelete,
      onSubmit,
      initialValues,
    }}
    decorators={[categorize, shouldRenderSource2]}
    label={standard.title}
    validate={validateStandardUpdate}
    component={EntityCard}
  >
    {({ handleSubmit }) => (
      <CardBlock>
        <StandardEditForm
          {...{ organizationId }}
          standardId={standard._id}
          save={handleSubmit}
        />
      </CardBlock>
    )}
  </EntityForm>
);

StandardSubcard.propTypes = {
  standard: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default StandardSubcard;
