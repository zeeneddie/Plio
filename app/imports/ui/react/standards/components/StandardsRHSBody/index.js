import React from 'react';

import { CollectionNames } from '/imports/share/constants';
import { getC } from '/imports/api/helpers';
import propTypes from './propTypes';
import Collapse from '../../../components/Collapse';
import StandardsRHSBodyHeading from '../StandardsRHSBodyHeading';
import StandardsRHSBodyContents from '../StandardsRHSBodyContents';
import SourceWordDocument from '../../../components/SourceWordDocument';
import SourceRead from '../../../components/SourceRead';
import ChangelogContainer from '../../../changelog/containers/ChangelogContainer';

const StandardsRHSBody = (props) => (
  <div className="content-list">
    <Collapse
      collapsed={props.collapsed}
      onToggleCollapse={props.onToggleCollapse}
    >
      <StandardsRHSBodyHeading {...props.standard} />
      <StandardsRHSBodyContents
        {...props.standard}
        files={props.files}
        orgSerialNumber={props.orgSerialNumber}
        ncs={props.ncs}
        risks={props.risks}
        actions={props.actions}
        workItems={props.workItems}
        lessons={props.lessons}
      />
    </Collapse>
    {getC('standard.source1.htmlUrl', props) && (
      <SourceWordDocument src={props.standard.source1.htmlUrl}>
        <SourceRead id={1} {...props.standard.source1} />
      </SourceWordDocument>
    )}
    {getC('standard.source2.htmlUrl', props) && (
      <SourceWordDocument src={props.standard.source2.htmlUrl}>
        <SourceRead id={2} {...props.standard.source2} />
      </SourceWordDocument>
    )}
    <ChangelogContainer
      documentId={props.standard ? props.standard._id : ''}
      collection={CollectionNames.STANDARDS}
    />
  </div>
);

StandardsRHSBody.propTypes = propTypes;

export default StandardsRHSBody;
