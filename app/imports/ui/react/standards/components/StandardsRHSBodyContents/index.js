import React from 'react';

import propTypes from './propTypes';
import _user_ from '/imports/startup/client/mixins/user';
import createReadFields from '../../../helpers/createReadFields';
import FieldReadDepartmentsContainer from '../../../containers/FieldReadDepartmentsContainer';
import SourceRead from '../../../components/SourceRead';
import { propEq } from '/imports/api/helpers';

const StandardsRHSBodyContents = ({
  description,
  issueNumber,
  owner,
  departmentsIds = [],
  source1,
  source2,
  section = {},
  type = {},
  files = [],
}) => {
  const wrap = 'col-md-6';
  const data = [
    { label: 'Description', text: description },
    { label: 'Issue number', text: issueNumber, wrap },
    { label: 'Section', text: section.title, wrap },
    { label: 'Type', text: type.title, wrap },
    { label: 'Owner', text: _user_.userNameOrEmail(owner), wrap },
  ];
  const fields = createReadFields(data);

  return (
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

      <FieldReadDepartmentsContainer departmentsIds={departmentsIds} />

      {source1 && (
        <SourceRead
          {...source1}
          id={1}
          file={files.find(propEq('_id', source1.fileId))}
        />
      )}

      {source2 && (
        <SourceRead
          {...source2}
          id={2}
          file={files.find(propEq('_id', source2.fileId))}
        />
      )}
    </div>
  );
};

StandardsRHSBodyContents.propTypes = propTypes;

export default StandardsRHSBodyContents;
