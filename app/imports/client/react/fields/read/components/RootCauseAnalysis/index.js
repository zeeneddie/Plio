import PropTypes from 'prop-types';
import React from 'react';

import createReadFields from '/imports/client/react/helpers/createReadFields';
import FileProvider from '/imports/client/react/containers/providers/FileProvider';

// TODO: needs testing

const RootCauseAnalysis = ({ causes, fileIds }) => {
  const data = causes.map(({ text, index }) => ({
    text,
    label: `Cause ${index}`,
  }));

  const fields = createReadFields(data);

  return (
    <div>
      {fields}
      {!!fileIds.length && fileIds.map(fileId => (
        <FileProvider key={fileId} {...{ fileId }} />
      ))}
    </div>
  );
};

RootCauseAnalysis.propTypes = {
  causes: PropTypes.arrayOf(Object),
  fileIds: PropTypes.arrayOf(PropTypes.string),
};

export default RootCauseAnalysis;
