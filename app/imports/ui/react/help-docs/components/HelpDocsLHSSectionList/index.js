import React from 'react';

import { createHelpSectionItem } from '../../helpers';
import LHSItem from '../../../components/LHSItem';
import HelpDocsLHSHelpList from '../HelpDocsLHSHelpList';
import propTypes from './propTypes';

const HelpDocsLHSSectionList = props => (
  <div>
    {props.sections.map(section => (
      <LHSItem
        key={section._id}
        item={createHelpSectionItem(section._id)}
        collapsed={props.collapsed}
        onToggleCollapse={props.onToggleCollapse}
        lText={section.title}
      >
        <HelpDocsLHSHelpList
          helpDocs={section.helpDocs}
          section={section}
          userHasChangeAccess={props.userHasChangeAccess}
        />
      </LHSItem>
    ))}
  </div>
);

HelpDocsLHSSectionList.propTypes = propTypes;

export default HelpDocsLHSSectionList;
