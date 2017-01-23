import React, { PropTypes } from 'react';
import { mapProps } from 'recompose';
import SectionDetailItem from './SectionItem';

const enhance = mapProps(({ children, ...rest }) => ({
  ...rest,
  children: children.filter(({ props }) => Boolean(props.children)),
}));

const SectionDetail = enhance(({ children, name }) => (
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

SectionDetail.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string,
};

SectionDetail.Item = SectionDetailItem;

export default SectionDetail;
