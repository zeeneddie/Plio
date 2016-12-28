import { compose, branch } from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import ModalWindow from '../../components/ModalWindow';
import { pickC, identity } from '/imports/api/helpers';
import withStateCollapsed from '../../helpers/withStateCollapsed';

export default compose(
  // if onToggleHelpPanel is not provided then make one by default
  branch(
    property('onToggleHelpPanel'),
    identity,
    withStateCollapsed(true, 'isHelpPanelCollapsed', 'onToggleHelpPanel'),
  ),
  connect(compose(pickC(['isSaving', 'errorText']), property('modal'))),
)(ModalWindow);
