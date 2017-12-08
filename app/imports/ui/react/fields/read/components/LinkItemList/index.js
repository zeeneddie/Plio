import React, { PropTypes } from 'react';

import Field from '../Field';
import LinkItem from '../LinkItem';

const LinkItemList = ({ items, label }) => (
<<<<<<< HEAD
  <Block>
    {label}
    <Field>
      {items.map(({
        _id, href, indicator, title, sequentialId,
      }) => (
        <LinkItem
          key={_id}
          {...{
            href, indicator, title, sequentialId,
          }}
        />
=======
  <div>
    <Field {...{label}}>
      {items.map(({ _id, href, indicator, title, sequentialId }) => (
        <LinkItem key={_id} {...{ href, indicator, title, sequentialId }} />
>>>>>>> d9bedfa586277a878b2e425b1cdf3771f9696b17
      ))}
    </Field>
  </div>
);

LinkItemList.propTypes = {
  label: PropTypes.string.isRequired,
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
