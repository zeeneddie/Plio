import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { sortByIds } from 'plio-util';
import { pathOr } from 'ramda';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies, GraphQLTypenames } from '../../../../api/constants';
import CanvasSectionItems from './CanvasSectionItems';
import CanvasSectionItem from './CanvasSectionItem';
import CanvasDraggableSquareIcon from './CanvasDraggableSquareIcon';
import CanvasLinkedItem from './CanvasLinkedItem';
import { WithState } from '../../helpers';

const CanvasItemList = ({
  organizationId,
  sectionName,
  renderEditModal,
  items,
}) => (
  <Query
    query={Queries.CANVAS_SETTINGS}
    variables={{ organizationId, sectionName }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { canvasSettings: { canvasSettings = {} } } }) => (
      <Mutation mutation={Mutations.REORDER_CANVAS_ITEMS}>
        {reorderCanvasItems => (
          <CanvasSectionItems
            onChange={order => (
              reorderCanvasItems({
                variables: {
                  input: {
                    organizationId,
                    sectionName,
                    order,
                  },
                },
                optimisticResponse: {
                  __typename: GraphQLTypenames.MUTATION,
                  reorderCanvasItems: {
                    __typename: GraphQLTypenames.CANVAS_SETTINGS,
                    ...canvasSettings,
                    [sectionName]: {
                      __typename: GraphQLTypenames.CANVAS_SECTION_SETTINGS,
                      order,
                    },
                  },
                },
              })
            )}
          >
            <WithState initialState={{ _id: null }}>
              {({ state, setState }) => (
                <Fragment>
                  {renderEditModal && renderEditModal({
                    _id: state._id,
                    isOpen: !!state._id,
                    toggle: () => setState({ _id: null }),
                  })}
                  {items && sortByIds(
                    pathOr([], [sectionName, 'order'], canvasSettings),
                    items,
                  ).map((({
                    _id,
                    color,
                    title,
                    matchedTo,
                  }) => (
                    <CanvasSectionItem
                      key={_id}
                      data-id={_id}
                      onClick={() => setState({ _id })}
                    >
                      <CanvasDraggableSquareIcon color={color} />
                      <span>
                        {title}
                        {matchedTo && (
                          <CanvasLinkedItem>
                            {matchedTo.title}
                          </CanvasLinkedItem>
                        )}
                      </span>
                    </CanvasSectionItem>
                  )))}
                </Fragment>
              )}
            </WithState>
          </CanvasSectionItems>
        )}
      </Mutation>
    )}
  </Query>
);

CanvasItemList.propTypes = {
  organizationId: PropTypes.string.isRequired,
  sectionName: PropTypes.string.isRequired,
  renderEditModal: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CanvasItemList;
