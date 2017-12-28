import { connect } from 'react-redux';
import { lifecycle, mapProps, shouldUpdate } from 'recompose';
import { pluck, equals } from 'ramda';
import connectUI from 'redux-ui';

import RiskSubcardAddExisting from '../components/RiskSubcardAddExisting';
import {
  getRisksAsItems,
  getRisksLinkedToStandard,
} from '../../../../client/store/selectors/risks';
import { getOrganizationId } from '../../../../client/store/selectors/organizations';
import { getLinkable as getLinkableRisks } from '../../../../api/risks/methods';
import { namedCompose } from '../../helpers';

export default namedCompose('RiskSubcardAddExistingContainer')(
  connect((state, props) => ({
    organizationId: getOrganizationId(state),
    risks: getRisksLinkedToStandard(state, props),
  })),
  shouldUpdate((props, nextProps) => (
    props.organizationId !== nextProps.organizationId ||
    props.selected !== nextProps.selected ||
    !equals(props.risks, nextProps.risks)
  )),
  connectUI({
    state: {
      risks: [],
    },
  }),
  lifecycle({
    async componentDidMount() {
      const { organizationId, updateUI } = this.props;
      const ids = pluck('_id', this.props.risks);
      try {
        const risks = await getLinkableRisks.callP({ organizationId, ids });
        updateUI('risks', getRisksAsItems({ collections: { risks } }));
      } catch (err) {
        updateUI('error', err.message);
      }
    },
  }),
  mapProps(({ ui, ...props }) => ({
    ...props,
    risks: ui.risks,
  })),
)(RiskSubcardAddExisting);
