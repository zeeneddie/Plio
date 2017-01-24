import React from 'react';
import property from 'lodash.property';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';

import propTypes from './propTypes';
import { ProblemsStatuses } from '/imports/share/constants';
import DocumentCard from '/imports/ui/react/components/DocumentCard';
import Label from '/imports/ui/react/components/Labels/Label';
import Icon from '/imports/ui/react/components/Icons/Icon';
import Button from 'reactstrap/lib/Button';

const BodyContents = ({
  title,
  sequentialId,
  status,
  description,
  notify,
  standards,
  orgSerialNumber,
  identifiedBy,
  identifiedAt,
  magnitude,
  type,
  departments,
  scores,
  correctiveActions,
  preventativeActions,
}) => (
  <DocumentCard>
    <DocumentCard.Section>
      <DocumentCard.SectionItem title="Risk name">
        {title && (
          <span>
            <span>{title}</span>
            <Label names="warning" margin="left">{sequentialId}</Label>
            <Label names="" className="text-default">{ProblemsStatuses[status]}</Label>
          </span>
        )}
      </DocumentCard.SectionItem>

      <DocumentCard.SectionItem title="Risk description">
        {description}
      </DocumentCard.SectionItem>

      <DocumentCard.SectionItem title="Standard(s)">
        {standards.length > 0 && standards.map(standard => (
          <Button
            tag="a"
            href={`/${orgSerialNumber}/standards/${standard._id}`}
            key={`standard-button-${standard._id}`}
            color="secondary"
            className="margin-right"
          >
            {standard.title}
          </Button>
        ))}
      </DocumentCard.SectionItem>

      <Row>
        <Col sm="6">
          <DocumentCard.SectionItem title="Identified by">
            {identifiedBy.firstName} {identifiedBy.lastName}
          </DocumentCard.SectionItem>
        </Col>
        <Col sm="6">
          <DocumentCard.SectionItem title="Date identified">
            {identifiedAt}
          </DocumentCard.SectionItem>
        </Col>
      </Row>

      <Row>
        <Col sm="6">
          <DocumentCard.SectionItem title="Initial categorization">
            {magnitude}
          </DocumentCard.SectionItem>
        </Col>
        <Col sm="6">
          <DocumentCard.SectionItem title="Type">
            {type.title}
          </DocumentCard.SectionItem>
        </Col>
      </Row>
      <DocumentCard.SectionItem title="Department(s)">
        {departments.length > 0 && departments.map(property('name')).join(', ')}
      </DocumentCard.SectionItem>
    </DocumentCard.Section>

    {notify.length > 0 && (
      <DocumentCard.Section name="Notify changes">
        <DocumentCard.SectionItem>
          {notify.map(user => (
            <h4
              key={user._id}
              className="list-group-item-heading"
            >
              {user.firstName} {user.lastName}
            </h4>
          ))}
        </DocumentCard.SectionItem>
      </DocumentCard.Section>
    )}

    {scores.length > 0 && (
      <DocumentCard.Section name="Risk scoring">
        <DocumentCard.SectionTableItem
          header={[
            'Score type',
            'Score',
            'Scored date',
            'Scored by',
          ]}
        >
          {scores.map(score => [
            <span className="list-group-item-heading">{score.scoreTypeId}</span>,
            <div>
              <Label margin="right" className={`impact-${score.className}`}>{score.value}</Label>
              <span className="list-group-item-heading margin-right">{score.priority}</span>
            </div>,
            <span className="list-group-item-heading">{score.scoredAt}</span>,
            <span className="list-group-item-heading">
              {score.scoredBy.firstName} {score.scoredBy.lastName}
            </span>,
          ])}
        </DocumentCard.SectionTableItem>
      </DocumentCard.Section>
    )}

    {correctiveActions.length > 0 && (
      <DocumentCard.Section name="Corrective actions">
        <DocumentCard.SectionItem>
          {correctiveActions && correctiveActions.map(action => (
            <Button
              tag="a"
              href={`/${orgSerialNumber}/work-inbox/${action._id}`}
              key={`standard-button-${action._id}`}
              color="secondary"
              className="margin-right"
            >
              {action.sequentialId} {action.title}
              <Icon name="circle" margin="left" className={`text-${action.className}`} />
            </Button>
          ))}
        </DocumentCard.SectionItem>
      </DocumentCard.Section>
    )}

    {preventativeActions.length > 0 && (
      <DocumentCard.Section name="Preventative actions">
        <DocumentCard.SectionItem>
          {preventativeActions.map(action => (
            <Button
              tag="a"
              href={`/${orgSerialNumber}/work-inbox/${action._id}`}
              key={`standard-button-${action._id}`}
              color="secondary"
              className="margin-right"
            >
              {action.sequentialId} {action.title}
              <Icon name="circle" margin="left" className={`text-${action.className}`} />
            </Button>
          ))}
        </DocumentCard.SectionItem>
      </DocumentCard.Section>
    )}
  </DocumentCard>
);

BodyContents.propTypes = propTypes;

export default BodyContents;
