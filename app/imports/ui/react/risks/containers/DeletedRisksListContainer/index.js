import { lifecycle, compose } from 'recompose';

import RisksListContainer from '../RisksListContainer';
import {
  getSelectedAndDefaultRiskByFilter,
  redirectToRiskOrDefault,
} from '../../helpers';
import { getState } from '/imports/client/store';
import { RiskFilterIndexes } from '/imports/api/constants';

const redirectHandle = (props) => setTimeout(() => {
  const { urlItemId } = getState('global');
  const risksByIds = getState('collections.risksByIds');
  const {
    defaultStandard,
    selectedStandard,
  } = getSelectedAndDefaultRiskByFilter({
    urlItemId,
    risks: props.risks,
    filter: RiskFilterIndexes.DELETED,
  });

  // if risk does not exist, do not redirect.
  // show message that risk does not exist instead.
  if (urlItemId && !risksByIds[urlItemId]) {
    return;
  }

  redirectToRiskOrDefault({ selectedStandard, defaultStandard });
}, 0);

export default compose(
  lifecycle({
    componentWillMount() {
      // handle redirect to default risk
      redirectHandle(this.props);
    },
  })
)(RisksListContainer);
