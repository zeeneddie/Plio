import React from 'react';

import { CollectionNames } from '/imports/share/constants';
import propTypes from './propTypes';
import Collapse from '../../../components/Collapse';
import StandardsRHSBodyHeading from '../StandardsRHSBodyHeading';
import StandardsRHSBodyContents from '../StandardsRHSBodyContents';
import ChangelogContainer from '../../../changelog/containers/ChangelogContainer';

const StandardsRHSBody = (props) => (
  <Collapse
    classNames={{ wrapper: 'content-list' }}
    collapsed={props.collapsed}
    onToggleCollapse={props.onToggleCollapse}
  >
    <StandardsRHSBodyHeading {...props.standard} />
    <div>
      <StandardsRHSBodyContents
        {...props.standard}
        files={props.files}
        orgSerialNumber={props.orgSerialNumber}
        ncs={props.ncs}
        risks={props.risks}
        actions={props.actions}
        workItems={props.workItems}
      />
      <ChangelogContainer
        documentId={props.standard ? props.standard._id : ''}
        collection={CollectionNames.STANDARDS}
      />
    </div>
  </Collapse>
);

StandardsRHSBody.propTypes = propTypes;

export default StandardsRHSBody;
