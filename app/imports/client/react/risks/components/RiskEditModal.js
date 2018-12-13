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
import { RisksHelp } from '../../../../api/help-messages';
import { validateRisk } from '../../../validation';
import RiskForm from './RiskForm';
import RiskEditForm from './RiskEditForm';

export const RiskEditModal = ({
  isOpen,
  toggle,
  organizationId,
  onDelete,
  loading,
  error,
  initialValues,
  onSubmit,
  risk,
  guidelines,
  userId,
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
    guidance={RisksHelp.risk}
  >
    <EntityModalForm
      {...{ initialValues, onSubmit }}
      validate={validateRisk}
    >
      {({ handleSubmit }) => (
        <Fragment>
          <EntityModalHeader label="Risk" />
          <EntityModalBody>
            <RenderSwitch
              {...{ loading }}
              renderLoading={(
                <CardBlock>
                  <RiskForm {...{ organizationId }} />
                </CardBlock>
              )}
              errorWhenMissing={noop}
              require={risk}
            >
              <CardBlock>
                <RiskEditForm
                  {...{ organizationId, guidelines, userId }}
                  save={handleSubmit}
                />
              </CardBlock>
            </RenderSwitch>
          </EntityModalBody>
        </Fragment>
      )}
    </EntityModalForm>
  </EntityModalNext>
);


RiskEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  risk: PropTypes.object,
  guidelines: PropTypes.object,
  userId: PropTypes.string,
};

export default pure(RiskEditModal);
