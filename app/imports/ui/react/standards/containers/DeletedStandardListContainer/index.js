import { lifecycle, compose } from 'recompose';

import StandardListContainer from '../StandardListContainer';
import {
  getSelectedAndDefaultStandardByFilter,
  redirectToStandardOrDefault,
} from '../../helpers';
import { getState } from '/imports/client/store';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';

const redirectHandle = (props) => setTimeout(() => {
  const { urlItemId } = getState('global');
  const {
    defaultStandard,
    selectedStandard,
  } = getSelectedAndDefaultStandardByFilter({
    urlItemId,
    standards: props.standards,
    filter: STANDARD_FILTER_MAP.DELETED,
  });

  redirectToStandardOrDefault({ selectedStandard, defaultStandard });
}, 0);

export default compose(
  lifecycle({
    componentWillMount() {
      // handle redirect to default standard
      redirectHandle(this.props);
    },
  })
)(StandardListContainer);
