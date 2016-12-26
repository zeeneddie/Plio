import React from 'react';

import PageContainer from '../../../containers/PageContainer';
import CustomersLHSContainer from '../../containers/LHSContainer';
import CustomersRHSContainer from '../../containers/RHSContainer';

const CustomersPage = () => (
  <PageContainer>
    <CustomersLHSContainer />
    <CustomersRHSContainer />
  </PageContainer>
);

export default CustomersPage;
