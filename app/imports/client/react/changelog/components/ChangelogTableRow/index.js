import React from 'react';

import propTypes from './propTypes';

const ChangelogTableRow = props => (
  <tr>
    <td className="log-user">{props.userName}</td>
    <td>{props.message}</td>
    <td>{props.prettyDate}</td>
  </tr>
);

ChangelogTableRow.propTypes = propTypes;

export default ChangelogTableRow;
