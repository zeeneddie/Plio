import React from 'react';

import createReadFields from '../../../helpers/createReadFields';
import SourceRead from '../../../components/SourceRead';
import propTypes from './propTypes';

const HelpDocsRHSBodyContents = (props) => {
  const { source, section, file, owner, issueNumber } = props;

  const wrap = 'col-md-6';
  const fields = createReadFields([
    { label: 'Section', text: section ? section.title : '' },
    { label: 'Issue number', text: issueNumber, wrap },
    { label: 'Owner', text: owner ? owner.fullNameOrEmail() : '', wrap },
  ]);

  return (
    <div className="list-group">
      {fields.section}

      <div className="row">
        {fields.issueNumber}
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
