import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { isNotEmpty } from 'plio-util';
import { pure } from 'recompose';

import { UserRoles, DocumentTypes } from '../../../../share/constants';
import { NotifySubcard, EntitiesField, RelationsAdapter } from '../../components';
import { GoalsSubcard } from '../../goals';
import StandardsSubcard from '../../standards/components/StandardsSubcard';
import NonconformitiesSubcard from '../../noncomformities/components/NonconformitiesSubcard';
import CanvasLessonsSubcard from './CanvasLessonsSubcard';
import ActivelyManageSubcard from './ActivleyManage/ActivelyManageSubcard';
import RisksSubcard from '../../risks/components/RisksSubcard';
import FilesSubcardContainer from './FilesSubcardContainer';

const CanvasSubcards = ({
  organizationId,
  refetchQueries,
  onChange,
  documentType,
  user: { roles = [] } = {},
  slingshotDirective,
  section: {
    title,
    _id: documentId,
    risks = [],
    lessons = [],
    goals = [],
    standards = [],
    nonconformities = [],
    potentialGains = [],
    organization: {
      currency,
      rkGuidelines,
      ncGuidelines,
      pgGuidelines,
    },
  },
}) => {
  const linkedTo = { _id: documentId, title };
  return (
    <Fragment>
      <ActivelyManageSubcard
        {...{
          rkGuidelines,
          ncGuidelines,
          pgGuidelines,
          organizationId,
          linkedTo,
          refetchQueries,
          documentType,
          goals,
          standards,
          risks,
          nonconformities,
          potentialGains,
          lessons,
        }}
      />
      {!!goals.length && (
        <RelationsAdapter
          {...{
            organizationId,
            goals,
            documentId,
            documentType,
            refetchQueries,
          }}
          relatedDocumentType={DocumentTypes.GOAL}
          render={GoalsSubcard}
          canEditGoals={roles.includes(UserRoles.CREATE_DELETE_GOALS)}
        />
      )}
      {!!standards.length && (
        <RelationsAdapter
          {...{
            organizationId,
            standards,
            documentId: linkedTo._id,
            documentType,
            refetchQueries,
          }}
          relatedDocumentType={DocumentTypes.STANDARD}
          render={StandardsSubcard}
        />
      )}
      {!!risks.length && (
        <RelationsAdapter
          {...{
            organizationId,
            risks,
            documentId: linkedTo._id,
            documentType,
            refetchQueries,
            linkedTo,
          }}
          relatedDocumentType={DocumentTypes.RISK}
          render={RisksSubcard}
          guidelines={rkGuidelines}
        />
      )}
      {!!nonconformities.length && (
        <RelationsAdapter
          {...{
            organizationId,
            nonconformities,
            documentId: linkedTo._id,
            documentType,
            refetchQueries,
            currency,
          }}
          relatedDocumentType={DocumentTypes.NON_CONFORMITY}
          type={DocumentTypes.NON_CONFORMITY}
          render={NonconformitiesSubcard}
          guidelines={ncGuidelines}
        />
      )}
      {!!potentialGains.length && (
        <RelationsAdapter
          {...{
            organizationId,
            documentId: linkedTo._id,
            documentType,
            refetchQueries,
            currency,
          }}
          relatedDocumentType={DocumentTypes.POTENTIAL_GAIN}
          type={DocumentTypes.POTENTIAL_GAIN}
          render={NonconformitiesSubcard}
          guidelines={pgGuidelines}
          nonconformities={potentialGains}
        />
      )}
      <EntitiesField
        name="lessons"
        render={CanvasLessonsSubcard}
        is={isNotEmpty}
        {...{
          organizationId,
          lessons,
          linkedTo,
          refetchQueries,
          documentType,
        }}
      />
      <EntitiesField
        name="files"
        render={props => <FilesSubcardContainer {...props} />}
        {...{
          documentId,
          organizationId,
          slingshotDirective,
          documentType,
          onChange,
        }}
      />
      <NotifySubcard {...{ documentId, organizationId, onChange }} />
    </Fragment>
  );
};

CanvasSubcards.propTypes = {
  section: PropTypes.object.isRequired,
  organizationId: PropTypes.string.isRequired,
  refetchQueries: PropTypes.func.isRequired,
  slingshotDirective: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default pure(CanvasSubcards);
