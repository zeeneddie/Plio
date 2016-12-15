import React, { PropTypes } from 'react';

import { CollectionNames } from '/imports/share/constants';
import PreloaderPage from '../../../../components/PreloaderPage';
import ChangelogContainer from '../../../../changelog/containers/ChangelogContainer';
import RHSBodyContainer from '../../../containers/RHSBodyContainer';
import Wrapper from '../../../../components/Wrapper';

const ContentList = ({ isReady = true, standard, hasDocxAttachment }) => (
  <Wrapper className="content-list">
    {isReady ? (
      <RHSBodyContainer {...{ standard, hasDocxAttachment }} />
    ) : (
      <Wrapper className="m-t-3">
        <PreloaderPage size={2} />
      </Wrapper>
    )}
    <ChangelogContainer
      documentId={standard ? standard._id : ''}
      collection={CollectionNames.STANDARDS}
    />
  </Wrapper>
);

ContentList.propTypes = {
  isReady: PropTypes.bool,
  hasDocxAttachment: PropTypes.bool,
  standard: PropTypes.object,
};

export default ContentList;
