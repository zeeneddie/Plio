import React, { PropTypes, Children } from 'react';
import { mapProps } from 'recompose';
import SectionItem from './SectionItem';

const enhance = mapProps(({ children, ...rest }) => ({
  ...rest,
  children: Children.map(children, child =>
    (Boolean(child.props.children) ? child : null)
  ),
}));

const Section = enhance(({ children, name }) => (
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
));

Section.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string,
};

Section.Item = SectionItem;

export default Section;
