import React from 'react';

import propTypes from './propTypes';
import { ProblemsStatuses } from '/imports/share/constants';
import DocumentCard from '/imports/ui/react/components/DocumentCard';
import Label from '/imports/ui/react/components/Labels/Label';

const BodyContents = (props => {
  const { title, sequentialId, status, description } = props.risk;

  return (
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
      </DocumentCard.Section>

      <DocumentCard.Section name="Notify changes">
        <DocumentCard.SectionItem>
          {props.notify.map(user => (
            <h4
              key={user.userId}
              className="list-group-item-heading"
            >
              {user.firstName} {user.lastName}
            </h4>
          ))}
        </DocumentCard.SectionItem>
      </DocumentCard.Section>
    </DocumentCard>
  );
});

BodyContents.propTypes = propTypes;

export default BodyContents;
