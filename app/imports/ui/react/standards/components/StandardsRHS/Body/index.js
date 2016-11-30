import React from 'react';

import { getC } from '/imports/api/helpers';
import propTypes from './propTypes';
import Collapse from '../../../../components/Collapse';
import BodyHeading from '../BodyHeading';
import BodyContents from '../BodyContents';
import SourceWordDocument from '../../../../components/SourceWordDocument';
import SourceRead from '../../../../components/SourceRead';
import Wrapper from '../../../../components/Wrapper';

const StandardsRHSBody = (props) => (
  <Wrapper>
    <Collapse
      collapsed={props.collapsed}
      onToggleCollapse={props.onToggleCollapse}
    >
      <BodyHeading {...props.standard} />
      <BodyContents
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
  </Wrapper>
);


StandardsRHSBody.propTypes = propTypes;

StandardsRHSBody.Heading = BodyHeading;
StandardsRHSBody.Contents = BodyContents;

export default StandardsRHSBody;
