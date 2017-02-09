import React, { PropTypes } from 'react';
import SectionItem from './SectionItem';

const Section = ({ children, name }) => (
  <div>
    {name && (
      <div className="card-block card-subheading">
        <h4 className="card-title">{name}</h4>
      </div>
    )}
    <div className="list-group">
      <span>{children}</span>
    </div>
  </div>
);

Section.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string,
};

Section.Item = SectionItem;

export default Section;
