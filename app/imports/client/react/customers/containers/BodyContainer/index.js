import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import { getOwnerId } from '/imports/api/organizations/helpers';
import Body from '../../components/RHS/Body';

const mapStateToProps = (state, { ownerId }) => ({ owner: state.collections.usersByIds[ownerId] });

export default compose(
  withProps(({ users }) => ({ ownerId: getOwnerId(users) })),
  connect(mapStateToProps),
)(Body);
