import React, { PropTypes } from 'react';
import { ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

const Field = ({ label, tag = 'h4', wrapper, heading, text, children }) => (
  <ListGroupItem {...wrapper}>
    {label && (
      <ListGroupItemText {...text}>{label}</ListGroupItemText>
    )}
    <ListGroupItemHeading {...{ tag, ...heading }}>
      {children}
    </ListGroupItemHeading>
  </ListGroupItem>
);

Field.propTypes = {
  wrapper: PropTypes.object,
  heading: PropTypes.object,
  text: PropTypes.object,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Field;
