import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { noop } from 'plio-util';

import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  RenderSwitch,
  CardBlock,
} from '../../components';
import { NonConformitiesHelp, PotentialGainsHelp } from '../../../../api/help-messages';
import { validateNonConformity } from '../../../validation';
import categorize from '../../forms/decorators/categorize';
import NonconformityAddForm from './NonconformityAddForm';
import NonconformityEditForm from './NonconformityEditForm';
import { ProblemTypes } from '../../../../share/constants';

export const NonconformityEditModal = ({
  isOpen,
  toggle,
  organizationId,
  onDelete,
  loading,
  error,
  initialValues,
  onSubmit,
  nonconformity,
  guidelines,
  userId,
  type,
  currency,
  refetchQueries,
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
    guidance={(
      type === ProblemTypes.NON_CONFORMITY
        ? NonConformitiesHelp.nonConformity
        : PotentialGainsHelp.potentialGain
    )}
  >
    <EntityModalForm
      {...{ initialValues, onSubmit }}
      decorators={[categorize]}
      validate={validateNonConformity}
    >
      {({ handleSubmit }) => (
        <Fragment>
          <EntityModalHeader
            label={type === ProblemTypes.NON_CONFORMITY ? 'Nonconformity' : 'Potential gain'}
          />
          <EntityModalBody>
            <RenderSwitch
              {...{ loading }}
              renderLoading={(
                <CardBlock>
                  <NonconformityAddForm {...{ organizationId }} />
                </CardBlock>
              )}
              errorWhenMissing={noop}
              require={nonconformity}
            >
              <CardBlock>
                <NonconformityEditForm
                  {...{
                    organizationId,
                    guidelines,
                    userId,
                    type,
                    currency,
                    refetchQueries,
                  }}
                  nonconformityId={nonconformity && nonconformity._id}
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


NonconformityEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  nonconformity: PropTypes.object,
  guidelines: PropTypes.object,
  userId: PropTypes.string,
  type: PropTypes.string.isRequired,
  currency: PropTypes.string,
  refetchQueries: PropTypes.func,
};

export default React.memo(NonconformityEditModal);
