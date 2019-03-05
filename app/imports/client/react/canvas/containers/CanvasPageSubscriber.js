import PropTypes from 'prop-types';
import { Component } from 'react';
import { whereEq, update, reject } from 'ramda';
import gql from 'graphql-tag';

import { CanvasSections, CanvasTypes } from '../../../../share/constants';
import { DocChangeKinds } from '../../../../share/subscriptions/constants';
import CANVAS_ENTITY_PRESENTATION from '../../../graphql/Fragment/CanvasEntityPresentation.graphql';
import VALUE_PROPOSITION_PRESENTATION
  from '../../../graphql/Fragment/ValuePropositionPresentation.graphql';
import CUSTOMER_SEGMENT_PRESENTATION
  from '../../../graphql/Fragment/CustomerSegmentPresentation.graphql';
import CANVAS_SETTINGS from '../../../graphql/Fragment/CanvasSettings.graphql';

const getNewData = (prevData, data) => {
  // canvas settings is not an array, but an object
  if (!Array.isArray(prevData)) return data.entity;

  const findDataEntity = whereEq({ _id: data.entity._id });

  switch (data.kind) {
    case DocChangeKinds.INSERT:
      return prevData.concat(data.entity);
    case DocChangeKinds.UPDATE:
      return update(prevData.findIndex(findDataEntity), data.entity, prevData);
    case DocChangeKinds.DELETE:
      return reject(findDataEntity, prevData);
    default:
      return prevData;
  }
};

const KEY_PARTNER_CHANGED = gql`
  subscription KeyPartnerChanged($organizationId: ID!) {
    keyPartnerChanged(organizationId: $organizationId) {
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
    keyActivityChanged(organizationId: $organizationId) {
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
    keyResourceChanged(organizationId: $organizationId) {
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
    valuePropositionChanged(organizationId: $organizationId) {
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
    customerRelationshipChanged(organizationId: $organizationId) {
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
    channelChanged(organizationId: $organizationId) {
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
    customerSegmentChanged(organizationId: $organizationId) {
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
    costLineChanged(organizationId: $organizationId) {
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
    revenueStreamChanged(organizationId: $organizationId) {
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

export default class CanvasPageSubscriber extends Component {
  static propTypes = {
    subscribe: PropTypes.func.isRequired,
    organizationId: PropTypes.string.isRequired,
    children: PropTypes.node,
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate(prevProps) {
    if (this.props.organizationId !== prevProps.organizationId) {
      this.unsubscribe();
      this.subscribe();
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  unsubscribeQueue = new Set()

  unsubscribe() {
    this.unsubscribeQueue.forEach(unsubscribe => unsubscribe());
    this.unsubscribeQueue.clear();
  }

  subscribe() {
    const { subscribe, organizationId } = this.props;

    subConfigs.forEach(([name, sectionName, subscription]) => {
      const unsubscribe = subscribe({
        document: subscription,
        variables: { organizationId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          let key = sectionName;
          const data = subscriptionData.data[name];

          if (data.kind === DocChangeKinds.INSERT) {
            // Scroll canvas section to bottom after adding an item to it
            // Is there a better way of doing this?
            const sectionEl = document.querySelector(`ul.${key}`);
            setTimeout(() => {
              if (sectionEl) sectionEl.scrollTop = sectionEl.scrollHeight;
            }, 0);
          }

          // CanvasSections[CanvasTypes.COST_LINE] -> 'costStructure'
          // Does changing it to 'costLines' break anything?
          if (key === CanvasSections[CanvasTypes.COST_LINE]) {
            key = 'costLines';
          }

          const prevData = prev[key][key];

          return {
            ...prev,
            [key]: {
              ...prev[key],
              [key]: getNewData(prevData, data),
            },
          };
        },
      });

      this.unsubscribeQueue.add(unsubscribe);
    });
  }

  render() {
    return this.props.children;
  }
}
