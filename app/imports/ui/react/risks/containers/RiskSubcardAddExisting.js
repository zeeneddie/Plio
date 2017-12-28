import { connect } from 'react-redux';
import { mapProps, shouldUpdate } from 'recompose';
import { equals, compose } from 'ramda';
import connectUI from 'redux-ui';
import { Meteor } from 'meteor/meteor';

import RiskSubcardAddExisting from '../components/RiskSubcardAddExisting';
import {
  getRisksAsItems,
  getRisksLinkedToStandard,
  getRisksIds,
} from '../../../../client/store/selectors/risks';
import { getOrganizationId } from '../../../../client/store/selectors/organizations';
import { namedCompose } from '../../helpers';
import { composeWithTracker } from '../../../../client/util';
import { Risks } from '../../../../share/collections';

export default namedCompose('RiskSubcardAddExistingContainer')(
  connect(state => ({
    organizationId: getOrganizationId(state),
  })),
  shouldUpdate((props, nextProps) => (
    props.organizationId !== nextProps.organizationId ||
    props.selected !== nextProps.selected ||
    props.standardId !== nextProps.standardId
  )),
  connectUI({
    state: {
      risks: [],
    },
  }),
  composeWithTracker(({ organizationId, standardId, ...props }, onData) => {
    const subscription = Meteor.subscribe(
      'Risks.getLinkableToStandard',
      { organizationId, standardId },
    );
    if (subscription.ready()) {
      const query = {
        organizationId,
        isDeleted: {
          $ne: true,
        },
        standardsIds: {
          $ne: standardId,
        },
      };
      const options = {
        sort: {
          serialNumber: 1,
        },
      };
      let risks = Risks.find(query, options).fetch();
      risks = getRisksAsItems({ collections: { risks } });

      onData(null, { ...props, ui: { risks } });
    } else {
      onData(null, props);
    }

    return () => subscription.stop();
  }, {
    propsToWatch: ['organizationId', 'standardId'],
  }),
  mapProps(({ ui, ...props }) => ({
    ...props,
    risks: ui.risks,
  })),
)(RiskSubcardAddExisting);
