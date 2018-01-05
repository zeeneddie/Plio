import PropTypes from 'prop-types';
import React from 'react';
import { getPath } from '/imports/ui/utils/router/paths';

const TransitionalLayout = ({ content }) => (
  <div className="jumbotron vertical-center table">
    <div className="table-cell text-xs-center">
      {content}
      <hr />
      <p>
        <img src="/p-logo.png" className="p-logo" alt="Plio" />
      </p>
      <p>
        <small>
          <span>Support: </span>
          <a href="mailto:steve.ives@pliohub.com">
            steve.ives@pliohub.com
          </a>
          <span> • </span>
          <a href={getPath('signOut')()}>
            Sign Out
          </a>
        </small>
      </p>
    </div>
  </div>
);

TransitionalLayout.propTypes = {
  content: PropTypes.node,
};

export default TransitionalLayout;
