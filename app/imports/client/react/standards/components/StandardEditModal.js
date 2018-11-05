import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { pure } from 'recompose';
import { noop } from 'plio-util';

import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  RenderSwitch,
  CardBlock,
} from '../../components';
import StandardAddForm from './StandardAddForm';
import StandardEditForm from './StandardEditForm';
import { StandardsHelp } from '../../../../api/help-messages';
import { validateStandard } from '../../../validation';

export const StandardEditModal = ({
  isOpen,
  toggle,
  organizationId,
  onDelete,
  loading,
  error,
  initialValues,
  onSubmit,
  standard,
}) => (
  <EntityModalNext
    {...{
      isOpen,
      toggle,
      loading,
      error,
      onDelete,
    }}
    isEditMode
    guidance={StandardsHelp.standard}
  >
    <EntityModalForm
      {...{ initialValues, onSubmit }}
      validate={validateStandard}
    >
      {({ handleSubmit }) => (
        <Fragment>
          <EntityModalHeader label="Standard" />
          <EntityModalBody>
            <RenderSwitch
              {...{ loading }}
              renderLoading={(
                <CardBlock>
                  <StandardAddForm {...{ organizationId }} />
                </CardBlock>
              )}
              errorWhenMissing={noop}
              require={standard}
            >
              {({ _id: standardId }) => (
                <CardBlock>
                  <StandardEditForm
                    {...{ organizationId, standardId }}
                    save={handleSubmit}
                  />
                </CardBlock>
              )}
            </RenderSwitch>
          </EntityModalBody>
        </Fragment>
      )}
    </EntityModalForm>
  </EntityModalNext>
);


StandardEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  standard: PropTypes.object,
};

export default pure(StandardEditModal);
