import { compose, withState, withHandlers, branch } from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import ModalWindow from '../../components/ModalWindow';
import { pickC, identity, not } from '/imports/api/helpers';

export default compose(
  // if onToggleHelpPanel is not provided then make one by default
  branch(
    property('onToggleHelpPanel'),
    identity,
    compose(
      withState('isHelpPanelCollapsed', 'setHelpPanelCollapsed', true),
      withHandlers({
        onToggleHelpPanel: ({ setHelpPanelCollapsed }) => () => setHelpPanelCollapsed(not),
      })
    )
  ),
  connect(compose(pickC(['isSaving', 'errorText']), property('modal'))),
)(ModalWindow);
