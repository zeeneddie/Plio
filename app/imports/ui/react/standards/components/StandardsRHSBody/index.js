import React from 'react';

import { CollectionNames } from '/imports/share/constants';
import propTypes from './propTypes';
import Collapse from '../../../components/Collapse';
import StandardsRHSBodyHeading from '../StandardsRHSBodyHeading';
import StandardsRHSBodyContents from '../StandardsRHSBodyContents';
import ChangelogContainer from '/imports/ui/react/changelog/containers/ChangelogContainer';

const StandardsRHSBody = (props) => (
  <Collapse
    classNames={{ wrapper: 'content-list' }}
    collapsed={props.collapsed}
    onToggleCollapse={props.onToggleCollapse}
  >
    <StandardsRHSBodyHeading standard={props.standard} />
    <div>
      <StandardsRHSBodyContents standard={props.standard} />
      <ChangelogContainer
        documentId={props.standard ? props.standard._id : ''}
        collection={CollectionNames.STANDARDS}
      />
    </div>
  </Collapse>
);

StandardsRHSBody.propTypes = propTypes;

export default StandardsRHSBody;
