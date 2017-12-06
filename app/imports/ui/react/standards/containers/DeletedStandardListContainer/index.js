import { lifecycle, compose } from 'recompose';
import { connect } from 'react-redux';

import StandardListContainer from '../StandardListContainer';
import {
  getSelectedAndDefaultStandardByFilter,
  redirectToStandardOrDefault,
} from '../../helpers';
import { pickDeep } from '/imports/api/helpers';
import { getState } from '/imports/client/store';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';

const redirectHandle = props => setTimeout(() => {
  const { urlItemId } = getState('global');
  const standardsByIds = getState('collections.standardsByIds');
  const {
    defaultStandard,
    selectedStandard,
  } = getSelectedAndDefaultStandardByFilter({
    urlItemId,
    standards: props.standards,
    filter: STANDARD_FILTER_MAP.DELETED,
  });

  // if standard does not exist, do not redirect.
  // show message that standard does not exist instead.
  if (urlItemId && !standardsByIds[urlItemId]) {
    return;
  }

  let redirectOptions = { selectedStandard, defaultStandard };
  if (props.searchText) {
    redirectOptions = { defaultStandard };
  }

  redirectToStandardOrDefault(redirectOptions);
}, 0);

export default compose(
  connect(pickDeep(['global.searchText', 'standards.standardsFiltered'])),
  lifecycle({
    componentWillMount() {
      // handle redirect to default standard
      redirectHandle(this.props);
    },
    componentWillReceiveProps(nextProps) {
      // redirect to first found standard
      if (nextProps.searchText && nextProps.standardsFiltered.length) {
        redirectHandle(nextProps);
      }
    },
  }),
)(StandardListContainer);
