import React from 'react';

import createReadFields from '../../../helpers/createReadFields';
import SourceRead from '../../../components/SourceRead';
import propTypes from './propTypes';

const HelpDocsRHSBodyContents = (props) => {
  const { source, section, file, owner, issueNumber } = props;

  const wrap = 'col-md-6';
  const fieldsData = [
    { label: 'Section', text: section ? section.title : '' },
    { label: 'Owner', text: owner ? owner.fullNameOrEmail() : '', wrap },
  ];

  if (props.userHasChangeAccess) {
    fieldsData.push({ label: 'Issue number', text: issueNumber, wrap });
  }

  const fields = createReadFields(fieldsData);

  return (
    <div className="list-group">
      {fields.section}

      <div className="row">
        {props.userHasChangeAccess ? fields.issueNumber : ''}
        {fields.owner}
      </div>

      {source ? (
        <SourceRead {...source} file={file} id={1} />
      ) : ''}
    </div>
  );
};

HelpDocsRHSBodyContents.propTypes = propTypes;

export default HelpDocsRHSBodyContents;
