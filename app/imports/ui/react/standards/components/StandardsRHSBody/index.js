import React from 'react';

import propTypes from './propTypes';
import Collapse from '../../../components/Collapse';
import StandardsRHSBodyHeading from '../StandardsRHSBodyHeading';
import StandardsRHSBodyContents from '../StandardsRHSBodyContents';

const StandardsRHSBody = (props) => (
  <Collapse
    classNames={{ wrapper: 'content-list' }}
    collapsed={props.collapsed}
    onToggleCollapse={props.onToggleCollapse}
  >
    <StandardsRHSBodyHeading {...props.standard} />
    <StandardsRHSBodyContents
      {...props.standard}
      files={props.files}
      orgSerialNumber={props.orgSerialNumber}
    />
  </Collapse>
);

StandardsRHSBody.propTypes = propTypes;

export default StandardsRHSBody;
