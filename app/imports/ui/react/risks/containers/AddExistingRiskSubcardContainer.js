import { connect } from 'react-redux';
import { compose, lifecycle, withState, mapProps } from 'recompose';
import { pluck, propOr } from 'ramda';
import ui from 'redux-ui';

import AddExistingRiskSubcard from '../components/AddExistingRiskSubcard';
import { getRisksAsItems } from '../../../../client/store/selectors/risks';
import { getOrganizationId } from '../../../../client/store/selectors/organizations';
import { getLinkable } from '../../../../api/risks/methods';

export default compose(
  connect(state => ({
    organizationId: getOrganizationId(state),
  })),
  withState('risks', 'setRisks', propOr([], 'risks')),
  ui(),
  lifecycle({
    async componentDidMount() {
      this.props.updateUI('error', 'test');
      // const { organizationId } = this.props;
      // const ids = pluck('_id', this.props.risks);
      // try {
      //   const risks = await getLinkable.callP({ organizationId, ids });
      //   this.props.setRisks(risks);
      // } catch (err) {
      //   this.props.updateUI('error', err.message);
      // }
    },
  }),
  mapProps(({ risks, ...props }) => ({
    risks: getRisksAsItems({ collections: { risks } }),
    ...props,
  })),
)(AddExistingRiskSubcard);
