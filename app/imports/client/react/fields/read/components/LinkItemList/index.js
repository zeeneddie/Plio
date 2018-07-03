import PropTypes from 'prop-types';
import React from 'react';

import Field from '../Field';
import LinkItem from '../LinkItem';

const LinkItemList = ({ items, label }) => (
  <div>
    <Field {...{ label }}>
      {items.map(({
        _id,
        href,
        indicator,
        title,
        sequentialId,
        onMouseUp, // temp
      }) => (
        <LinkItem
          key={_id}
          {...{
            href,
            indicator,
            title,
            sequentialId,
            onMouseUp,
          }}
        />
      ))}
    </Field>
  </div>
);

LinkItemList.propTypes = {
  label: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    sequentialId: PropTypes.string,
    status: PropTypes.number,
    href: PropTypes.string,
    indicator: PropTypes.string,
  })).isRequired,
};

export default LinkItemList;
