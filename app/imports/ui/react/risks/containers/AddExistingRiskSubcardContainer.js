import { connect } from 'react-redux';
import { compose, lifecycle, mapProps, shouldUpdate } from 'recompose';
import { pluck } from 'ramda';
import uiState from 'redux-ui';

import AddExistingRiskSubcard from '../components/AddExistingRiskSubcard';
import { getRisksAsItems } from '../../../../client/store/selectors/risks';
import { getOrganizationId } from '../../../../client/store/selectors/organizations';
import { getLinkable as getLinkableRisks } from '../../../../api/risks/methods';

export default compose(
  shouldUpdate((props, nextProps) => (
    props.risks.length !== nextProps.risks.length ||
    props.selected !== nextProps.selected
  )),
  connect(state => ({
    organizationId: getOrganizationId(state),
  })),
  uiState({
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
)(AddExistingRiskSubcard);
