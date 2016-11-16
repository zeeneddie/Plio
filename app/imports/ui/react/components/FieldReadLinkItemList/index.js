import React from 'react';

import propTypes from './propTypes';
import FieldRead from '../FieldRead';
import FieldReadBlock from '../FieldReadBlock';
import FieldReadLinkItem from '../FieldReadLinkItem';

const FieldReadLinkItemList = ({ items, label }) => (
  <FieldReadBlock label={label}>
    <FieldRead>
      {items.map(({ _id, href, indicator, title, sequentialId }) => (
        <FieldReadLinkItem
          key={_id}
          href={href}
          indicator={indicator}
          title={title}
          sequentialId={sequentialId}
        />
      ))}
    </FieldRead>
  </FieldReadBlock>
);

FieldReadLinkItemList.propTypes = propTypes;

export default FieldReadLinkItemList;
