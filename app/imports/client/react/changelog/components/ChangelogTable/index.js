import React from 'react';
import { _ } from 'meteor/underscore';

import ChangelogTableRowContainer from '../../containers/ChangelogTableRowContainer';
import propTypes from './propTypes';

const ChangelogTable = props => (
  <table className="table table-sm">
    <thead>
      <tr>
        <th>Name</th>
        <th>Change summary</th>
        <th>Date &amp; time</th>
      </tr>
    </thead>
    <tbody>
      {props.logs.map(log => (
        <ChangelogTableRowContainer
          key={log._id}
          {..._.pick(log, ['date', 'executor', 'message'])}
        />
      ))}
    </tbody>
  </table>
);

ChangelogTable.propTypes = propTypes;

export default ChangelogTable;
