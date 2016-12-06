import React, { PropTypes } from 'react';

import SectionListItemContainer from '../../containers/SectionListItemContainer';

const SectionList = ({ sections, ...props }) => (
  <div>
    {sections.map(section => (
      <SectionListItemContainer key={section._id} {...props} {...section} />
    ))}
  </div>
);

SectionList.propTypes = {
  sections: PropTypes.array.isRequired,
};

export default SectionList;
