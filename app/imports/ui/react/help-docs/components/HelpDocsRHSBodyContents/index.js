import React from 'react';

import createReadFields from '../../../helpers/createReadFields';
import SourceRead from '../../../components/SourceRead';
import propTypes from './propTypes';

const HelpDocsRHSBodyContents = ({ source, section, file }) => {
  const fields = createReadFields([{
    label: 'Section',
    text: section.title,
  }]);

  return (
    <div className="list-group">
      {fields.section}

      <SourceRead {...source} file={file} id={1} />
    </div>
  );
};

HelpDocsRHSBodyContents.propTypes = propTypes;

export default HelpDocsRHSBodyContents;
