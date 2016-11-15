import React from 'react';

import ChangelogTable from '../ChangelogTable';
import propTypes from './propTypes';

const ChangelogContent = (props) => (
  <div>
    {props.logs.length ? (
      <ChangelogTable logs={props.logs} />
    ) : (
      <span>Changelog is empty</span>
    )}
  </div>
);

ChangelogContent.propTypes = propTypes;

export default ChangelogContent;
