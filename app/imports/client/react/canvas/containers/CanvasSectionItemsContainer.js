import { graphql } from 'react-apollo';
import { pure, mapProps, withState } from 'recompose';
import { sortByIds } from 'plio-util';
import { omit, prop } from 'ramda';

import CanvasSectionItems from '../components/CanvasSectionItems';
import { Query, Mutation } from '../../../graphql';
import { namedCompose } from '../../helpers';
import { ApolloFetchPolicies } from '../../../../api/constants';

export default namedCompose('CanvasSectionItemsContainer')(
  pure,
  graphql(Query.CANVAS_SETTINGS, {
    options: ({ organizationId, sectionName }) => ({
      variables: { organizationId, sectionName },
      fetchPolicy: ApolloFetchPolicies.CACHE_ONLY,
    }),
    props: ({
      data: { canvasSettings: { canvasSettings = {} } },
      ownProps: { items, sectionName },
    }) => {
      const { order } = canvasSettings[sectionName] || {};
      return {
        order,
        items: sortByIds(items, order),
      };
    },
  }),
  withState('order', 'setOrder', prop('order')),
  graphql(Mutation.REORDER_CANVAS_ITEMS, {
    props: ({
      mutate,
      ownProps: { organizationId, sectionName, setOrder },
    }) => ({
      onChange: (newOrder) => {
        setOrder(newOrder);
        return mutate({
          variables: {
            input: {
              organizationId,
              sectionName,
              newOrder,
            },
          },
        });
      },
    }),
  }),
  mapProps(({ order, items, ...props }) => ({
    items: sortByIds(items, order),
    ...omit([
      'organizationId',
      'sectionName',
      'setOrder',
    ], props),
  })),
)(CanvasSectionItems);
