import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import createReadFields from '../../../../helpers/createReadFields';
import DepartmentsContainer from '../../../../fields/read/containers/DepartmentsContainer';
import Source from '../../../../fields/read/components/Source';
import Notify from '../../../../fields/read/components/Notify';
import ImprovementPlan from '../../../../fields/read/components/ImprovementPlan';
import FileProvider from '../../../../containers/providers/FileProvider';
import ConnectedDocListContainer from '../../../fields/read/containers/ConnectedDocListContainer';

const BodyContents = ({
  _id,
  description,
  issueNumber,
  owner,
  departmentsIds = [],
  source1,
  source2,
  notify,
  improvementPlan,
  section = {},
  type = {},
}) => {
  const wrap = 'col-md-6';
  const data = [
    { label: 'Description', text: description },
    { label: 'Issue number', text: issueNumber, wrap },
    { label: 'Section', text: section.title, wrap },
    { label: 'Type', text: cx(type.title, type.abbreviation && `(${type.abbreviation})`), wrap },
    { label: 'Owner', text: getUserFullNameOrEmail(owner), wrap },
  ];
  const fields = createReadFields(data);

  return (
    <div>
      <div className="list-group">
        {fields.description}

        <div className="row">
          {fields.issueNumber}
          {fields.section}
        </div>

        <div className="row">
          {fields.type}
          {fields.owner}
        </div>

        {!!departmentsIds.length && (
          <DepartmentsContainer departmentsIds={departmentsIds} />
        )}

        {[source1, source2].map((source, i) => source && (
          <FileProvider
            key={i}
            id={i + 1}
            component={Source}
            flat={false}
            {...{ ...source, fileId: source.fileId || '' }}
          />
        ))}
      </div>

      {notify ? (<Notify users={[...notify]} />) : null}

      <ConnectedDocListContainer standardId={_id}>
        {improvementPlan && (
          <ImprovementPlan
            label="Improvement Plan"
            {...improvementPlan}
          />
        )}
      </ConnectedDocListContainer>
    </div>
  );
};

BodyContents.propTypes = propTypes;

export default BodyContents;
