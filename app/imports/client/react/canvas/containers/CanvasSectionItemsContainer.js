import { graphql } from 'react-apollo';
import { pure, mapProps } from 'recompose';
import { sortByIds } from 'plio-util';
import { omit } from 'ramda';

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
        items: sortByIds(items, order),
      };
    },
  }),
  graphql(Mutation.REORDER_CANVAS_ITEMS, {
    props: ({
      mutate,
      ownProps: { organizationId, sectionName },
    }) => ({
      onChange: newOrder => (
        mutate({
          variables: {
            input: {
              organizationId,
              sectionName,
              newOrder,
            },
          },
        })
      ),
    }),
  }),
  mapProps(omit([
    'organizationId',
    'sectionName',
  ])),
)(CanvasSectionItems);
