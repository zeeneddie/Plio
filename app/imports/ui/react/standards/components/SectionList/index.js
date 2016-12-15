import React, { PropTypes } from 'react';

import SectionListItem from '../SectionListItem';

const SectionList = ({ sections, ...props }) => (
  <div>
    {sections.map(section => (
      <SectionListItem key={section._id} section={section} {...props} />
    ))}
  </div>
);

SectionList.propTypes = {
  sections: PropTypes.array.isRequired,
};

export default SectionList;
