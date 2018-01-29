import connectUI from 'redux-ui';
import { withHandlers } from 'recompose';

import { namedCompose, withStore } from '../../helpers';
import GoalAddModal from '../components/GoalAddModal';

export default namedCompose('GoalAddModalContainer')(
  withStore,
  connectUI({
    state: {
      title: '',
      description: '',
      ownerId: null,
      startDate: () => new Date(),
      endDate: null,
      priority: null,
      color: null,
    },
  }),
  withHandlers({
    onSubmit: props => () => {
      console.log(props);
    },
  }),
)(GoalAddModal);
