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
  ImprovementPlanSubcard,
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
import ReviewsSubcard from '../../reviews/components/ReviewsSubcard';

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
              {({
                _id: standardId,
                nonconformities,
                risks,
                lessons,
                reviews,
                organization: {
                  ncGuidelines,
                  rkGuidelines,
                  currency,
                },
              }) => {
                const linkedTo = {
                  _id: standardId,
                  title: standard.title,
                };
                return (
                  <Fragment>
                    <CardBlock>
                      <StandardEditForm
                        {...{ organizationId, standardId }}
                        save={handleSubmit}
                      />
                    </CardBlock>
                    <RelationsAdapter
                      {...{ organizationId, refetchQueries }}
                      documentId={standardId}
                      nonconformities={nonconformities}
                      documentType={DocumentTypes.STANDARD}
                      relatedDocumentType={DocumentTypes.NON_CONFORMITY}
                      type={DocumentTypes.NON_CONFORMITY}
                      guidelines={ncGuidelines}
                      currency={currency}
                      render={NonconformitiesSubcard}
                    />
                    <RelationsAdapter
                      {...{ organizationId, refetchQueries, linkedTo }}
                      documentId={standardId}
                      documentType={DocumentTypes.STANDARD}
                      risks={risks}
                      relatedDocumentType={DocumentTypes.RISK}
                      guidelines={rkGuidelines}
                      render={RisksSubcard}
                    />
                    <ImprovementPlanSubcard />
                    <EntitiesField
                      {...{ organizationId, refetchQueries, linkedTo }}
                      name="lessons"
                      render={LessonsSubcard}
                      lessons={lessons}
                      documentType={DocumentTypes.STANDARD}
                    />
                    <EntitiesField
                      {...{ organizationId, refetchQueries, linkedTo }}
                      name="reviews"
                      render={ReviewsSubcard}
                      reviews={reviews}
                      documentType={DocumentTypes.STANDARD}
                    />
                    <NotifySubcard
                      {...{ organizationId }}
                      onChange={handleSubmit}
                      documentId={standardId}
                    />
                  </Fragment>
                );
              }}
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
