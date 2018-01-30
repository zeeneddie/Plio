import connectUI from 'redux-ui';
import { withHandlers, mapProps } from 'recompose';
import { lenses } from 'plio-util';
import { view } from 'ramda';

import { namedCompose, withStore } from '../../helpers';
import GoalAddModal from '../components/GoalAddModal';
import { GoalPriorities } from '../../../../share/constants';

export default namedCompose('GoalAddModalContainer')(
  withStore,
  connectUI({
    state: {
      title: '',
      description: '',
      ownerId: view(lenses.ownerId),
      startDate: () => new Date(),
      endDate: null,
      priority: GoalPriorities.MINOR,
      color: null,
      errorText: '',
    },
  }),
  withHandlers({
    onSubmit: props => () => {
      console.log(props);
    },
  }),
  mapProps(({
    ui: { errorText },
    ...props
  }) => ({ errorText, ...props })),
)(GoalAddModal);
