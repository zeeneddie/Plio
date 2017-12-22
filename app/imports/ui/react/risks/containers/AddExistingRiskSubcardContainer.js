import { connect } from 'react-redux';
import { compose, withProps, lifecycle, withState } from 'recompose';
import { pluck, propOr } from 'ramda';

import AddExistingRiskSubcard from '../components/AddExistingRiskSubcard';
import { getRisksAsItems } from '../../../../client/store/selectors/risks';
import store from '../../../../client/store';
import { getOrganizationId } from '../../../../client/store/selectors/organizations';
import { getLinkable } from '../../../../api/risks/methods';

export default compose(
  withProps(() => ({ store })),
  connect(state => ({
    organizationId: getOrganizationId(state),
  })),
  withState('risks', 'setRisks', propOr([], 'risks')),
  lifecycle({
    async componentDidMount() {
      const { organizationId } = this.props;
      const ids = pluck('_id', this.props.risks);
      const risks = await getLinkable.callP({ organizationId, ids });
      this.props.setRisks(risks);
    },
  }),
  connect((state, { risks }) => ({
    risks: getRisksAsItems({ collections: { risks } }),
  })),
)(AddExistingRiskSubcard);
