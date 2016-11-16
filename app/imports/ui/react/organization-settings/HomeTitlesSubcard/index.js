import React, { PropTypes } from 'react';
import { withState } from 'recompose';
import cx from 'classnames';
import { PullMap } from '/imports/api/constants';
import { _ } from 'meteor/underscore';

const HomeTitlesSubcard = ({ children, pull }) => (
  <div>
    
  </div>
);

HomeTitlesSubcard.propTypes = {
  children: PropTypes.node,
  pull: PropTypes.oneOf(_.keys(PullMap)),
};

export default HomeTitlesSubcard;
