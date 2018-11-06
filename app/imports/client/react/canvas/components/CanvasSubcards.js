import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { isNotEmpty } from 'plio-util';

import { ProblemTypes, UserRoles } from '../../../../share/constants';
import { NotifySubcard, EntitiesField } from '../../components';
import { GoalsSubcard } from '../../goals';
import StandardsSubcard from '../../standards/components/StandardsSubcard';
import NonconformitiesSubcard from '../../noncomformities/components/NonconformitiesSubcard';
import CanvasLessonsSubcard from './CanvasLessonsSubcard';
import ActivelyManageSubcard from './ActivleyManage/ActivelyManageSubcard';
import RisksSubcard from '../../risks/components/RisksSubcard';

const CanvasSubcards = ({
  organizationId,
  refetchQuery,
  onChange,
  documentType,
  user: { roles = [] } = {},
  section: {
    title,
    _id: documentId,
    risks = [],
    lessons = [],
    goals = [],
    standards = [],
    nonconformities = [],
    potentialGains = [],
    organization: { rkGuidelines, ncGuidelines, pgGuidelines },
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
          refetchQuery,
          onChange,
          documentType,
        }}
      />
      <EntitiesField
        name="goals"
        render={GoalsSubcard}
        is={isNotEmpty}
        canEditGoals={roles.includes(UserRoles.CREATE_DELETE_GOALS)}
        {...{ organizationId, goals, onChange }}
      />
      <EntitiesField
        name="standards"
        render={StandardsSubcard}
        is={isNotEmpty}
        {...{ organizationId, standards, onChange }}
      />
      <EntitiesField
        name="risks"
        render={RisksSubcard}
        is={isNotEmpty}
        guidelines={rkGuidelines}
        {...{
          organizationId,
          risks,
          linkedTo,
          onChange,
        }}
      />
      <EntitiesField
        name="nonconformities"
        render={NonconformitiesSubcard}
        type={ProblemTypes.NON_CONFORMITY}
        is={isNotEmpty}
        guidelines={ncGuidelines}
        {...{ organizationId, nonconformities, onChange }}
      />
      <EntitiesField
        name="potentialGains"
        render={NonconformitiesSubcard}
        type={ProblemTypes.POTENTIAL_GAIN}
        nonconformities={potentialGains}
        is={isNotEmpty}
        guidelines={pgGuidelines}
        {...{ organizationId, onChange }}
      />
      <EntitiesField
        name="lessons"
        render={CanvasLessonsSubcard}
        is={isNotEmpty}
        {...{
          organizationId,
          lessons,
          linkedTo,
          refetchQuery,
          documentType,
        }}
      />
      <NotifySubcard {...{ documentId, organizationId, onChange }} />
    </Fragment>
  );
};

CanvasSubcards.propTypes = {
  section: PropTypes.object.isRequired,
  organizationId: PropTypes.string.isRequired,
  refetchQuery: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default CanvasSubcards;
