import React, { PropTypes } from 'react';

import PreloaderPage from '../../../../components/PreloaderPage';
import CustomersRHSBody from '../Body';
import Wrapper from '../../../../components/Wrapper';

const CustomersRHSContentList = ({ isReady = true, organization }) => (
  <Wrapper className="content-list">
    {isReady ? (
      <CustomersRHSBody organization={organization} />
    ) : (
      <Wrapper className="m-t-3">
        <PreloaderPage size={2} />
      </Wrapper>
    )}
  </Wrapper>
);

CustomersRHSContentList.propTypes = {
  isReady: PropTypes.bool,
  organization: PropTypes.object,
};

export default CustomersRHSContentList;
