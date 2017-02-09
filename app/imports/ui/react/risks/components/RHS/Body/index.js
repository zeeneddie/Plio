import React from 'react';
import property from 'lodash.property';
import { ListGroupItemHeading, Row, Col } from 'reactstrap';

import propTypes from './propTypes';
import { ProblemsStatuses } from '/imports/share/constants';
import DocumentCard from '/imports/ui/react/components/DocumentCard';
import Label from '/imports/ui/react/components/Labels/Label';
import LinkItemList from '/imports/ui/react/fields/read/components/LinkItemList';

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

      {standards.length > 0 && (
        <LinkItemList label="Standard(s)" items={standards} />
      )}

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
            <ListGroupItemHeading tag="h4" key={user._id}>
              {user.firstName} {user.lastName}
            </ListGroupItemHeading>
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
            <ListGroupItemHeading tag="span">{score.scoreTypeId}</ListGroupItemHeading>,
            <div>
              <Label margin="right" className={`impact-${score.className}`}>{score.value}</Label>
              <ListGroupItemHeading tag="span" className="margin-right">
                {score.priority}
              </ListGroupItemHeading>
            </div>,
            <ListGroupItemHeading tag="span">{score.scoredAt}</ListGroupItemHeading>,
            <ListGroupItemHeading tag="span">
              {score.scoredBy.firstName} {score.scoredBy.lastName}
            </ListGroupItemHeading>,
          ])}
        </DocumentCard.SectionTableItem>
      </DocumentCard.Section>
    )}

    {correctiveActions.length > 0 && (
      <LinkItemList label="Corrective actions" items={correctiveActions} />
    )}

    {preventativeActions.length > 0 && (
      <LinkItemList label="Preventative actions" items={preventativeActions} />
    )}

    {lessons.length > 0 && (
      <LinkItemList label="Lessons Learned" items={lessons} />
    )}
  </DocumentCard>
);

Body.propTypes = propTypes;

export default Body;
