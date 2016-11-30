import React from 'react';

import { CollectionNames } from '/imports/share/constants';
import PreloaderPage from '../../../../components/PreloaderPage';
import ChangelogContainer from '../../../../changelog/containers/ChangelogContainer';
import StandardsRHSBodyContainer from '../../../containers/StandardsRHSBodyContainer';
import Wrapper from '../../../../components/Wrapper';

const StandardsRHSContentList = ({ isReady = true, ...props }) => (
  <Wrapper className="content-list">
    {isReady ? (
      <StandardsRHSBodyContainer {...props} />
    ) : (
      <Wrapper className="m-t-3">
        <PreloaderPage size={2} />
      </Wrapper>
    )}
    <ChangelogContainer
      documentId={props.standard._id}
      collection={CollectionNames.STANDARDS}
    />
  </Wrapper>
);

export default StandardsRHSContentList;
