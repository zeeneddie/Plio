import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { propEq } from '/imports/api/helpers';
import StandardsRHS from '../../components/StandardsRHS';

const mapStateToProps = ({
  standards: {
    standards,
    isCardReady,
  },
  global: {
    urlItemId,
  },
}) => ({
  standards,
  urlItemId,
  isCardReady,
});

export default compose(
  connect(mapStateToProps),
  withProps(props => ({
    standard: props.standards.find(propEq('_id', props.urlItemId)),
    names: {
      headerNames: {
        header: 'Compliance Standard',
        discuss: 'Discuss',
        edit: 'Edit',
        restore: 'Restore',
        delete: 'Delete',
      },
    },
  })),
)(StandardsRHS);
