import React from 'react';
import { Row, Col, ListGroup } from 'reactstrap';

import propTypes from './propTypes';
import { ProblemsStatuses } from '/imports/share/constants';
import Label from '/imports/ui/react/components/Labels/Label';
import LinkItemList from '/imports/ui/react/fields/read/components/LinkItemList';
import ImprovementPlan from '/imports/ui/react/fields/read/components/ImprovementPlan';
import Notify from '/imports/ui/react/fields/read/components/Notify';
import { getFullName } from '/imports/api/users/helpers';
import Field from '/imports/ui/react/fields/read/components/Field';
import Block from '/imports/ui/react/fields/read/components/Block';
import Departments from '/imports/ui/react/fields/read/components/Departments';
import ScoringTable from '/imports/ui/react/components/ScoringTable';

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

      {!!departments.length && (<Departments departments={departments} />)}
    </ListGroup>

    {!!notify.length && (<Notify users={notify} />)}

    {!!scores.length && (
      <Block>
        <span>Risk scoring</span>
        <ScoringTable big borderless {...{ scores }} />
      </Block>
    )}

    {improvementPlan && (
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
  </div>
);

Body.propTypes = propTypes;

export default Body;
