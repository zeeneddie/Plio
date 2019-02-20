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
  RelationsAdapter,
} from '../../components';
import { DocumentTypes } from '../../../../share/constants';
import categorize from '../../forms/decorators/categorize';
import shouldRenderSource2 from '../../forms/decorators/shouldRenderSource2';
import StandardAddForm from './StandardAddForm';
import StandardEditForm from './StandardEditForm';
import NonconformitiesSubcard from '../../noncomformities/components/NonconformitiesSubcard';
import { StandardsHelp } from '../../../../api/help-messages';
import { validateStandardUpdate } from '../../../validation';

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
      decorators={[categorize, shouldRenderSource2]}
      validate={validateStandardUpdate}
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
                <Fragment>
                  <CardBlock>
                    <StandardEditForm
                      {...{ organizationId, standardId }}
                      save={handleSubmit}
                    />
                  </CardBlock>
                  <RelationsAdapter
                    {...{ organizationId }}
                    documentId={standard._id}
                    nonconformities={standard.nonconformities || []}
                    documentType={DocumentTypes.STANDARD}
                    relatedDocumentType={DocumentTypes.NON_CONFORMITY}
                    type={DocumentTypes.NON_CONFORMITY}
                    render={NonconformitiesSubcard}
                  />
                </Fragment>
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

export default React.memo(StandardEditModal);
