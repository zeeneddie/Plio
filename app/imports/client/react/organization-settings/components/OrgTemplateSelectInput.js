import React, { memo, useCallback } from 'react';
import { mapEntitiesToOptions } from 'plio-util';

import { Query as Queries } from '../../../graphql';
import ApolloSelectInputField from '../../forms/components/ApolloSelectInputField';
import { CustomerTypes } from '../../../../share/constants';

const OrgTemplateSelectInput = memo((props) => {
  const transformOptions = useCallback(({ data: { organizations: { organizations } } }) => {
    const orgs = organizations.map(({ name, ...org }) => ({
      name,
      title: name,
      ...org,
    }));
    return mapEntitiesToOptions(orgs);
  }, []);

  return (
    <ApolloSelectInputField
      {...{ transformOptions, ...props }}
      loadOptions={query => query({
        query: Queries.ORGANIZATIONS,
        variables: {
          customerType: CustomerTypes.TEMPLATE,
        },
      })}
    />
  );
});

export default OrgTemplateSelectInput;
