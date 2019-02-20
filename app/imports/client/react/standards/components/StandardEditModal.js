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
  EntitiesField,
  NotifySubcard,
} from '../../components';
import { DocumentTypes } from '../../../../share/constants';
import categorize from '../../forms/decorators/categorize';
import shouldRenderSource2 from '../../forms/decorators/shouldRenderSource2';
import StandardAddForm from './StandardAddForm';
import StandardEditForm from './StandardEditForm';
import NonconformitiesSubcard from '../../noncomformities/components/NonconformitiesSubcard';
import { StandardsHelp } from '../../../../api/help-messages';
import { validateStandardUpdate } from '../../../validation';
import LessonsSubcard from '../../lessons/components/LessonsSubcard';
import RisksSubcard from '../../risks/components/RisksSubcard';

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
                    {...{ organizationId, refetchQueries }}
                    documentId={standard._id}
                    nonconformities={standard.nonconformities}
                    documentType={DocumentTypes.STANDARD}
                    relatedDocumentType={DocumentTypes.NON_CONFORMITY}
                    type={DocumentTypes.NON_CONFORMITY}
                    guidelines={standard.organization.ncGuidelines}
                    currency={standard.organization.currency}
                    render={NonconformitiesSubcard}
                  />
                  <RelationsAdapter
                    {...{ organizationId, refetchQueries }}
                    documentId={standard._id}
                    documentType={DocumentTypes.STANDARD}
                    risks={standard.risks}
                    relatedDocumentType={DocumentTypes.RISK}
                    guidelines={standard.organization.rkGuidelines}
                    render={RisksSubcard}
                    linkedTo={{
                      _id: standard._id,
                      title: standard.title,
                    }}
                  />
                  <EntitiesField
                    {...{ organizationId, refetchQueries }}
                    name="lessons"
                    render={LessonsSubcard}
                    lessons={standard.lessons}
                    documentType={DocumentTypes.STANDARD}
                    linkedTo={{
                      _id: standard._id,
                      title: standard.title,
                    }}
                  />
                  <NotifySubcard
                    {...{ organizationId }}
                    onChange={handleSubmit}
                    documentId={standard._id}
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
  refetchQueries: PropTypes.func,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  standard: PropTypes.object,
};

export default React.memo(StandardEditModal);
