import React from 'react';

import propTypes from './propTypes';
import _user_ from '/imports/startup/client/mixins/user';
import createReadFields from '../../../helpers/createReadFields';
import FieldReadDepartmentsContainer from '../../../containers/FieldReadDepartmentsContainer';

const StandardsRHSBodyContents = ({
  standard: {
    description,
    issueNumber,
    owner,
    departmentsIds = [],
    section = {},
    type = {},
  } = {},
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
    </div>
  );
};

StandardsRHSBodyContents.propTypes = propTypes;

export default StandardsRHSBodyContents;
