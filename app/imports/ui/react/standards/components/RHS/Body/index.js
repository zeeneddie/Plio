import React, { PropTypes } from 'react';

import { getC } from '/imports/api/helpers';
import Collapse from '../../../../components/Collapse';
import BodyHeading from '../BodyHeading';
import BodyContents from '../BodyContents';
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
    <Collapse {...{ collapsed, onToggleCollapse }}>
      <BodyHeading {...standard} />
      <BodyContents {...standard} />
    </Collapse>
    {[standard.source1, standard.source2].map((source, key) => (
      getC('htmlUrl', source) && (
        <SourceWordDocument key={key} src={source.htmlUrl}>
          <FileProvider component={Source} {...{ ...source }} />
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
