import { compose, withHandlers, withContext } from 'recompose';
import { connect } from 'react-redux';
import ui from 'redux-ui';
import { PropTypes } from 'prop-types';

import RisksSubcard from '../../components/RisksSubcard';
import store from '../../../../../client/store';
import {
  getOrganizationId,
} from '../../../../../client/store/selectors/organizations';
import { getRisksLinkedToStandard } from '../../../../../client/store/selectors/risks';
import { onSave } from './handlers';

export default compose(
  // TEMP
  withContext(
    { store: PropTypes.object },
    () => ({ store }),
  ),
  connect((state, { standardId }) => ({
    organizationId: getOrganizationId(state),
    risks: getRisksLinkedToStandard(state, { standardId }),
  })),
  ui({
    state: {
      error: null,
      opened: null,
      isSaving: false,
    },
  }),
  withHandlers({ onSave }),
)(RisksSubcard);
