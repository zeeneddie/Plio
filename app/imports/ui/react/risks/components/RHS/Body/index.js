import React, { PropTypes } from 'react';
import { Row, Col, ListGroup } from 'reactstrap';
import { _ } from 'meteor/underscore';

import { ProblemsStatuses } from '/imports/share/constants';
import { AnalysisTitles } from '/imports/api/constants';
import Label from '/imports/ui/react/components/Labels/Label';
import LinkItemList from '/imports/ui/react/fields/read/components/LinkItemList';
import ImprovementPlan from '/imports/ui/react/fields/read/components/ImprovementPlan';
import Notify from '/imports/ui/react/fields/read/components/Notify';
import { getFullName } from '/imports/api/users/helpers';
import Field from '/imports/ui/react/fields/read/components/Field';
import Block from '/imports/ui/react/fields/read/components/Block';
import Departments from '/imports/ui/react/fields/read/components/Departments';
import ScoringTable from '/imports/ui/react/components/ScoringTable';
import Evaluation from '/imports/ui/react/components/Evaluation';
import FileProvider from '/imports/ui/react/containers/providers/FileProvider';
import Analysis from '/imports/ui/react/fields/read/components/Analysis';

const propTypes = {
  title: PropTypes.string,
  sequentialId: PropTypes.string,
  status: PropTypes.number,
  description: PropTypes.string,
  notify: PropTypes.arrayOf(PropTypes.object),
  standards: PropTypes.arrayOf(PropTypes.object),
  identifiedBy: PropTypes.object,
  identifiedAt: PropTypes.string,
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
  title,
  sequentialId,
  status,
  description,
  notify,
  standards,
  identifiedBy,
  identifiedAt,
  magnitude,
  type,
  departments,
  scores,
  correctiveActions,
  preventativeActions,
  lessons,
  improvementPlan,
  riskEvaluation,
  fileIds,
  analysis,
  updateOfStandards,
}) => (
  <div>
    <ListGroup>
      <Field label="Risk name">
        {title && (
          <span>
            <span>{title}</span>
            <Label names="warning" margin="left">{sequentialId}</Label>
            <Label names="" className="text-default">{ProblemsStatuses[status]}</Label>
          </span>
        )}
      </Field>

      {description && (
        <Field label="Risk description">
          {description}
        </Field>
      )}

      {!!standards.length && (
        <LinkItemList label="Standard(s)" items={standards} />
      )}

      <Row>
        <Col sm="6">
          <Field label="Identified by">
            {getFullName(identifiedBy)}
          </Field>
        </Col>
        <Col sm="6">
          <Field label="Date identified">
            {identifiedAt}
          </Field>
        </Col>
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

      {!!departments.length && (<Departments {...{ departments }} />)}
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

    {!!notify.length && (<Notify users={notify} />)}

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
      <LinkItemList label="Corrective actions" items={correctiveActions} />
    )}

    {!!preventativeActions.length && (
      <LinkItemList label="Preventative actions" items={preventativeActions} />
    )}

    {!!lessons.length && (
      <LinkItemList label="Lessons Learned" items={lessons} />
    )}

    {!!fileIds.length && (
      <Block>
        <span>Other files</span>
        <Field>
          {fileIds.map((fileId) => (
            <FileProvider key={fileId} {...{ fileId }} />
          ))}
        </Field>
      </Block>
    )}
  </div>
);

Body.propTypes = propTypes;

export default Body;
