import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';
import FieldRead from '../FieldRead';
import FieldReadBlock from '../FieldReadBlock';

const NCsRead = ({ ncs }) => (
  <FieldReadBlock label="Non-conformities">
    <FieldRead>
      {ncs.map(({ title, sequentialId, href, indicator }) => (
        <a
          href={href}
          className="btn btn-secondary btn-inline pointer"
        >
          <strong>{sequentialId}</strong>
          <span>{title}</span>
          <i
            className={cx(
              'fa fa-circle margin-left',
              `text-${indicator}`
            )}
          ></i>
        </a>
      ))}
    </FieldRead>
  </FieldReadBlock>
);

NCsRead.propTypes = propTypes;

export default NCsRead;
