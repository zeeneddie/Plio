import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col, ListGroup } from 'reactstrap';
import { _ } from 'meteor/underscore';

import { ProblemsStatuses, DocumentTypes } from '/imports/share/constants';
import { AnalysisTitles } from '/imports/api/constants';
import { getFullNameOrEmail } from '/imports/api/users/helpers';
import { getClassByStatus } from '/imports/api/problems/helpers';
import Label from '/imports/ui/react/components/Labels/Label';
import LinkItemList from '/imports/ui/react/fields/read/components/LinkItemList';
import Lessons from '/imports/ui/react/fields/read/components/Lessons';
import ImprovementPlan from '/imports/ui/react/fields/read/components/ImprovementPlan';
import Notify from '/imports/ui/react/fields/read/components/Notify';
import Field from '/imports/ui/react/fields/read/components/Field';
import Block from '/imports/ui/react/fields/read/components/Block';
import Departments from '/imports/ui/react/fields/read/components/Departments';
import ScoringTable from '/imports/ui/react/components/ScoringTable';
import Evaluation from '/imports/ui/react/components/Evaluation';
import FileProvider from '/imports/ui/react/containers/providers/FileProvider';
import Analysis from '/imports/ui/react/fields/read/components/Analysis';
import ReviewsContainer from '/imports/ui/react/fields/read/containers/ReviewsContainer';

const propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string,
  sequentialId: PropTypes.string,
  status: PropTypes.number,
  description: PropTypes.string,
  notify: PropTypes.arrayOf(PropTypes.object),
  standards: PropTypes.arrayOf(PropTypes.object),
  originatorId: PropTypes.object,
  ownerId: PropTypes.object,
  magnitude: PropTypes.string,
  type: PropTypes.object,
  departments: PropTypes.arrayOf(PropTypes.object),
  scores: PropTypes.arrayOf(PropTypes.object),
  correctiveActions: PropTypes.arrayOf(PropTypes.object),
  preventativeActions: PropTypes.arrayOf(PropTypes.object),
  lessons: PropTypes.arrayOf(PropTypes.object),
  improvementPlan: PropTypes.object,
  riskEvaluation: PropTypes.object,
  fileIds: PropTypes.arrayOf(PropTypes.string),
  analysis: PropTypes.object,
  updateOfStandards: PropTypes.object,
};

const Body = ({
  _id,
  title,
  sequentialId,
  status,
  description,
  notify,
  standards,
  originatorId,
  ownerId,
  magnitude,
  type = {},
  departments,
  scores,
  correctiveActions,
  preventativeActions,
  lessons,
  improvementPlan,
  riskEvaluation,
  fileIds = [],
  analysis,
  updateOfStandards,
}) => (
  <div>
    <ListGroup>
      <Field label="Risk name">
        {title && (
          <span>
            <span>{title}</span>
            <Label names={getClassByStatus(status)} margin="left">{sequentialId}</Label>
            <Label names="" className="text-default">{ProblemsStatuses[status]}</Label>
          </span>
        )}
      </Field>

      {description && (
        <Field label="Risk description">
          {description}
        </Field>
      )}

      {standards && !!standards.length && (
        <LinkItemList label="Standard(s)" items={standards} />
      )}

      <Row>
        {originatorId && (
          <Col sm="6">
            <Field label="Originator">
              {getFullNameOrEmail(originatorId)}
            </Field>
          </Col>
        )}
        {ownerId && (
          <Col sm="6">
            <Field label="Owner">
              {getFullNameOrEmail(ownerId)}
            </Field>
          </Col>
        )}
      </Row>

      <Row>
        <Col sm="6">
          <Field label="Initial categorization">
            {magnitude}
          </Field>
        </Col>
        <Col sm="6">
          <Field label="Type">
            {type.title}
          </Field>
        </Col>
      </Row>

      {departments && !!departments.length && (<Departments {...{ departments }} />)}
    </ListGroup>

    {(analysis.executor || analysis.targetDate) && (
      <Block>
        <span>{AnalysisTitles.riskAnalysis}</span>
        <Analysis {...analysis} />
      </Block>
    )}

    {analysis.status === 1 && (updateOfStandards.executor || updateOfStandards.targetDate) && (
      <Block>
        <span>{AnalysisTitles.updateOfRiskRecord}</span>
        <Analysis {...updateOfStandards} />
      </Block>
    )}

    {!_.isEmpty(riskEvaluation) && (
      <Block>
        <span>Risk evaluation</span>
        <Evaluation {...riskEvaluation} />
      </Block>
    )}

    {!!scores.length && (
      <Block>
        <span>Risk scoring</span>
        <ScoringTable big borderless {...{ scores }} />
      </Block>
    )}

    {!_.isEmpty(improvementPlan) && (
      <ImprovementPlan label="Treatment plan" {...improvementPlan} />
    )}

    {!!correctiveActions.length && (
      <Block>
        <span>Corrective actions</span>
        <LinkItemList items={correctiveActions} />
      </Block>
    )}

    {!!preventativeActions.length && (
      <Block>
        <span>Preventative actions</span>
        <LinkItemList items={preventativeActions} />
      </Block>
    )}

    {!!lessons.length && (<Lessons {...{ lessons }} />)}

    {!!fileIds.length && (
      <Block>
        <span>Other files</span>
        <Field>
          {fileIds.map(fileId => (
            <FileProvider key={fileId} {...{ fileId }} />
          ))}
        </Field>
      </Block>
    )}

    <ReviewsContainer documentId={_id} documentType={DocumentTypes.RISK} />

    {notify && !!notify.length && (<Notify users={notify} />)}
  </div>
);

Body.propTypes = propTypes;

export default Body;
