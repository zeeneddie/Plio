import { graphql } from 'react-apollo';
import { withProps, withHandlers } from 'recompose';

import { Mutation } from '../../../../client/graphql';
import { namedCompose } from '../../helpers';
import { onSave } from '../../milestones/handlers';
import NewMilestoneForm from '../components/NewMilestoneForm';

const { CREATE_MILESTONE } = Mutation;

export default namedCompose('NewMilestoneFormContainer')(
  withProps(({
    goal: {
      _id,
      title,
      sequentialId,
      color,
    },
  }) => ({
    linkedTo: {
      _id,
      title,
      sequentialId,
    },
    color,
  })),
  graphql(CREATE_MILESTONE, { name: CREATE_MILESTONE.name }),
  withHandlers({ onSubmit: onSave }),
)(NewMilestoneForm);
