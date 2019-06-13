import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Row } from 'reactstrap';
import { bySequentialId, noop } from 'plio-util';
import { Mutation } from 'react-apollo';
import { ifElse, isNil, always, converge, concat, propOr, compose, sort } from 'ramda';

import { Composer } from '../../helpers';
import { Mutation as Mutations, Query as Queries } from '../../../graphql';
import Matcher from './Matcher';
import { Col } from '../../components';

const getRefetchQueries = variables => [{
  query: Queries.CUSTOMER_SEGMENT_CARD,
  variables,
}];

const getSuggestedItems = ifElse(
  isNil,
  always([]),
  compose(
    sort(bySequentialId),
    converge(concat, [
      propOr([], 'benefits'),
      propOr([], 'features'),
    ]),
  ),
);

const CustomerInsightsMatcher = ({
  needs,
  wants,
  documentId,
  matchedTo,
  organizationId,
}) => {
  const customerInsights = needs.concat(wants);
  return (
    <Composer
      components={[
        /* eslint-disable react/no-children-prop */
        <Mutation
          mutation={Mutations.CREATE_RELATION}
          refetchQueries={getRefetchQueries({ _id: documentId, organizationId })}
          children={noop}
        />,
        <Mutation
          mutation={Mutations.DELETE_RELATION}
          refetchQueries={getRefetchQueries({ _id: documentId, organizationId })}
          children={noop}
        />,
        /* eslint-enable react/no-children-prop */
      ]}
    >
      {([createRelation, deleteRelation]) => (
        <Fragment>
          <Row>
            <Col xs="6">
              <legend>Needs & wants</legend>
            </Col>
            <Col xs="6">
              <legend>Features & benefits</legend>
            </Col>
          </Row>
          {!customerInsights.length && (
            <Row>
              <Col xs="6" className="text-muted">None</Col>
              <Col xs="6" className="text-muted">None</Col>
            </Row>
          )}
          {customerInsights.sort(bySequentialId).map(({
            _id,
            sequentialId,
            title,
            benefits,
            features,
            documentType,
          }) => (
            <Matcher
              {...{
                _id,
                sequentialId,
                title,
                documentType,
              }}
              key={_id}
              matchedItems={benefits.concat(features).sort(bySequentialId)}
              suggestedItems={getSuggestedItems(matchedTo)}
              onMatch={createRelation}
              onUnmatch={deleteRelation}
              hasMatchedDocument={!!matchedTo}
              /* eslint-disable max-len */
              noSuggestedItemsText="No Features or Benefits found. Please add some to the Value proposition"
              noMatchedDocumentText="No Value proposition found. Please add one, with some Features and Benefits"
              /* eslint-enable max-len */
            />
          ))}
        </Fragment>
      )}
    </Composer>
  );
};

CustomerInsightsMatcher.propTypes = {
  needs: PropTypes.arrayOf(PropTypes.object).isRequired,
  wants: PropTypes.arrayOf(PropTypes.object).isRequired,
  documentId: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  matchedTo: PropTypes.shape({
    benefits: PropTypes.arrayOf(PropTypes.object),
    features: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default CustomerInsightsMatcher;
