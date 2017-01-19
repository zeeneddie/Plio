import React, { PropTypes } from 'react';

import CollapseBlock from '../../../../components/CollapseBlock';
import BodyHeading from '../BodyHeading';
import BodyContents from '../BodyContents';
import RHSBodyContentsContainer from '../../../containers/RHSBodyContentsContainer';
import Wrapper from '../../../../components/Wrapper';

const RisksRHSBody = ({
  collapsed,
  risk = {},
  onToggleCollapse,
}) => (
  <Wrapper>
    <CollapseBlock {...{ collapsed, onToggleCollapse }}>
      <BodyHeading {...risk} />
      <RHSBodyContentsContainer {...risk} />
    </CollapseBlock>
  </Wrapper>
);


RisksRHSBody.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  risk: PropTypes.object,
};

RisksRHSBody.Heading = BodyHeading;
RisksRHSBody.Contents = BodyContents;

export default RisksRHSBody;
