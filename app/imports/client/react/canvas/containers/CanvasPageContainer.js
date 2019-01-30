import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { reject, whereEq } from 'ramda';

import { RenderSwitch, PreloaderPage, ErrorPage } from '../../components';
import CanvasPage from '../components/CanvasPage';
import withUpdateLastAccessedDate from '../../helpers/withUpdateLastAccessedDate';
import Lifecycle from '../../helpers/Lifecycle';
import { Query as Queries } from '../../../graphql';
import CANVAS_ENTITY_PRESENTATION from '../../../graphql/Fragment/CanvasEntityPresentation.graphql';
import VALUE_PROPOSITION_PRESENTATION
  from '../../../graphql/Fragment/ValuePropositionPresentation.graphql';
import CUSTOMER_SEGMENT_PRESENTATION
  from '../../../graphql/Fragment/CustomerSegmentPresentation.graphql';
import CANVAS_SETTINGS from '../../../graphql/Fragment/CanvasSettings.graphql';
import { CanvasSections, CanvasTypes } from '../../../../share/constants';

const KEY_PARTNER_CHANGED = gql`
  subscription KeyPartnerChanged($organizationId: ID!) {
    keyPartnerChanged(organizationId: $organizationId, kind: [insert, delete]) {
      kind
      entity {
        ...CanvasEntityPresentation
      }
    }
  }
  ${CANVAS_ENTITY_PRESENTATION}
`;
const KEY_ACTIVITY_CHANGED = gql`
  subscription KeyActivityChanged($organizationId: ID!) {
    keyActivityChanged(organizationId: $organizationId, kind: [insert, delete]) {
      kind
      entity {
        ...CanvasEntityPresentation
      }
    }
  }
  ${CANVAS_ENTITY_PRESENTATION}
`;
const KEY_RESOURCE_CHANGED = gql`
  subscription KeyResourceChanged($organizationId: ID!) {
    keyResourceChanged(organizationId: $organizationId, kind: [insert, delete]) {
      kind
      entity {
        ...CanvasEntityPresentation
      }
    }
  }
  ${CANVAS_ENTITY_PRESENTATION}
`;
const VALUE_PROPOSITION_CHANGED = gql`
  subscription ValuePropositionChanged($organizationId: ID!) {
    valuePropositionChanged(organizationId: $organizationId, kind: [insert, delete]) {
      kind
      entity {
        ...ValuePropositionPresentation
      }
    }
  }
  ${CANVAS_ENTITY_PRESENTATION}
  ${VALUE_PROPOSITION_PRESENTATION}
`;
const CUSTOMER_RELATIONSHIP_CHANGED = gql`
  subscription CustomerRelationshipChanged($organizationId: ID!) {
    customerRelationshipChanged(organizationId: $organizationId, kind: [insert, delete]) {
      kind
      entity {
        ...CanvasEntityPresentation
      }
    }
  }
  ${CANVAS_ENTITY_PRESENTATION}
`;
const CHANNEL_CHANGED = gql`
  subscription ChannelChanged($organizationId: ID!) {
    channelChanged(organizationId: $organizationId, kind: [insert, delete]) {
      kind
      entity {
        ...CanvasEntityPresentation
      }
    }
  }
  ${CANVAS_ENTITY_PRESENTATION}
`;
const CUSTOMER_SEGMENT_CHANGED = gql`
  subscription CustomerSegmentChanged($organizationId: ID!) {
    customerSegmentChanged(organizationId: $organizationId, kind: [insert, delete]) {
      kind
      entity {
        ...CustomerSegmentPresentation
      }
    }
  }
  ${CANVAS_ENTITY_PRESENTATION}
  ${CUSTOMER_SEGMENT_PRESENTATION}
`;
const COST_LINE_CHANGED = gql`
  subscription CostLineChanged($organizationId: ID!) {
    costLineChanged(organizationId: $organizationId, kind: [insert, delete]) {
      kind
      entity {
        ...CanvasEntityPresentation
      }
    }
  }
  ${CANVAS_ENTITY_PRESENTATION}
`;
const REVENUE_STREAM_CHANGED = gql`
  subscription RevenueStreamChanged($organizationId: ID!) {
    revenueStreamChanged(organizationId: $organizationId, kind: [insert, delete]) {
      kind
      entity {
        ...CanvasEntityPresentation
      }
    }
  }
  ${CANVAS_ENTITY_PRESENTATION}
`;

const CANVAS_SETTINGS_CHANGED = gql`
  subscription CanvasSettingsChanged($organizationId: ID!) {
    canvasSettingsChanged(organizationId: $organizationId, kind: [update]) {
      entity {
        ...CanvasSettings
      }
    }
  }
  ${CANVAS_SETTINGS}
`;

const subConfigs = [
  ['keyPartnerChanged', CanvasSections[CanvasTypes.KEY_PARTNER], KEY_PARTNER_CHANGED],
  ['keyActivityChanged', CanvasSections[CanvasTypes.KEY_ACTIVITY], KEY_ACTIVITY_CHANGED],
  ['keyResourceChanged', CanvasSections[CanvasTypes.KEY_RESOURCE], KEY_RESOURCE_CHANGED],
  [
    'valuePropositionChanged',
    CanvasSections[CanvasTypes.VALUE_PROPOSITION],
    VALUE_PROPOSITION_CHANGED,
  ],
  [
    'customerRelationshipChanged',
    CanvasSections[CanvasTypes.CUSTOMER_RELATIONSHIP],
    CUSTOMER_RELATIONSHIP_CHANGED,
  ],
  ['channelChanged', CanvasSections[CanvasTypes.CHANNEL], CHANNEL_CHANGED],
  [
    'customerSegmentChanged',
    CanvasSections[CanvasTypes.CUSTOMER_SEGMENT],
    CUSTOMER_SEGMENT_CHANGED,
  ],
  ['costLineChanged', CanvasSections[CanvasTypes.COST_LINE], COST_LINE_CHANGED],
  ['revenueStreamChanged', CanvasSections[CanvasTypes.REVENUE_STREAM], REVENUE_STREAM_CHANGED],
  ['canvasSettingsChanged', 'canvasSettings', CANVAS_SETTINGS_CHANGED],
];

const CanvasPageContainer = ({ organization: { _id: organizationId } }) => (
  <Query query={Queries.CANVAS_PAGE} variables={{ organizationId }}>
    {({ error, loading, subscribeToMore }) => (
      <RenderSwitch
        {...{ error, loading }}
        renderLoading={<PreloaderPage />}
        renderError={queryError => <ErrorPage error={queryError} />}
      >
        {() => (
          <Lifecycle
            didMount={() => {
              const subscribeToChanges = (name, sectionName, subscription) => {
                let key = sectionName;

                subscribeToMore({
                  document: subscription,
                  variables: { organizationId },
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const data = subscriptionData.data[name];

                    if (key === 'canvasSettings') {
                      return {
                        ...prev,
                        [key]: {
                          ...prev[key],
                          [key]: data.entity,
                        },
                      };
                    }

                    if (data.kind === 'insert') {
                      // Scroll canvas section to bottom after adding an item to it
                      // Is there a better way of doing this?
                      const sectionEl = document.querySelector(`ul.${key}`);
                      setTimeout(() => {
                        sectionEl.scrollTop = sectionEl.scrollHeight;
                      }, 0);
                    }

                    // CanvasSections[CanvasTypes.COST_LINE] -> 'costStructure'
                    // Does changing it to 'costLines' break anything?
                    if (key === CanvasSections[CanvasTypes.COST_LINE]) {
                      key = 'costLines';
                    }

                    const prevItems = prev[key][key];

                    return {
                      ...prev,
                      [key]: {
                        ...prev[key],
                        [key]: data.kind === 'insert'
                          ? prevItems.concat(data.entity)
                          : reject(whereEq({ _id: data.entity._id }), prevItems),
                      },
                    };
                  },
                });
              };

              subConfigs.forEach(args => subscribeToChanges(...args));
            }}
          >
            <CanvasPage {...{ organizationId }} />
          </Lifecycle>
        )}
      </RenderSwitch>
    )}
  </Query>
);

CanvasPageContainer.propTypes = {
  organization: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

CanvasPageContainer.subscriptions = {
  KEY_PARTNER_CHANGED,
  KEY_ACTIVITY_CHANGED,
  KEY_RESOURCE_CHANGED,
  VALUE_PROPOSITION_CHANGED,
  CUSTOMER_RELATIONSHIP_CHANGED,
  CHANNEL_CHANGED,
  CUSTOMER_SEGMENT_CHANGED,
  COST_LINE_CHANGED,
  REVENUE_STREAM_CHANGED,
};

export default withUpdateLastAccessedDate(CanvasPageContainer);
