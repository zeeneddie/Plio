import React from 'react';
import { ApolloProvider } from 'react-apollo';

import { client } from '../../../apollo';
import CategorizeField from './CategorizeField';
import SelectInput from './SelectInput';

const CategorizeFieldBlazeWrap = props => (
  <ApolloProvider {...{ client }}>
    <CategorizeField
      component={SelectInput}
      {...props}
    />
  </ApolloProvider>
);

export default CategorizeFieldBlazeWrap;
