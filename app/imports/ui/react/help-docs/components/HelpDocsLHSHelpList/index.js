import React from 'react';

import HelpDocsLHSListItemContainer from '../../containers/HelpDocsLHSListItemContainer';
import propTypes from './propTypes';

const HelpDocsLHSHelpList = (props) => (
  <div className="list-group">
    {props.helpDocs.map(help => (
      <HelpDocsLHSListItemContainer
        key={help._id}
        section={props.section}
        {...help}
      />
    ))}
  </div>
);

HelpDocsLHSHelpList.propTypes = propTypes;

export default HelpDocsLHSHelpList;
