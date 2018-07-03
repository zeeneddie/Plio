import PropTypes from 'prop-types';
import React from 'react';

import { getC } from '/imports/api/helpers';
import CollapseBlock from '../../../../components/CollapseBlock';
import BodyHeading from '../BodyHeading';
import BodyContents from '../BodyContents';
import RHSBodyContentsContainer from '../../../containers/RHSBodyContentsContainer';
import SourceWordDocument from '../../../../components/SourceWordDocument';
import Source from '../../../../fields/read/components/Source';
import Wrapper from '../../../../components/Wrapper';
import FileProvider from '../../../../containers/providers/FileProvider';

const StandardsRHSBody = ({
  collapsed,
  standard = {},
  onToggleCollapse,
}) => (
  <Wrapper>
    <CollapseBlock {...{ collapsed, onToggleCollapse }}>
      <BodyHeading {...standard} />
      <RHSBodyContentsContainer {...standard} />
    </CollapseBlock>
    {[standard.source1, standard.source2].map((source, key) => (
      getC('htmlUrl', source) && (
        <SourceWordDocument {...{ key }} src={source.htmlUrl}>
          <FileProvider flat={false} component={Source} {...{ ...source }} />
        </SourceWordDocument>
      )
    ))}
  </Wrapper>
);


StandardsRHSBody.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  standard: PropTypes.object,
};

StandardsRHSBody.Heading = BodyHeading;
StandardsRHSBody.Contents = BodyContents;

export default StandardsRHSBody;
