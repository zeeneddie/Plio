import { compose, shouldUpdate } from 'recompose';
import { connect } from 'react-redux';

import { lengthStandards, lengthTypes, propEq } from '/imports/api/helpers';
import TypeList from '../../components/TypeList';

export default compose(
  shouldUpdate((props, nextProps) => !!(lengthStandards(props) !== lengthStandards(nextProps))),
  connect((_, { standards }) => (state) => ({
    types: state.collections.standardTypes.map(type => ({
      ...type,
      standards: standards.filter(propEq('typeId', type._id)),
    })).filter(lengthStandards),
  })),
  shouldUpdate((props, nextProps) => !!(
    lengthTypes(props) !== lengthTypes(nextProps) ||
    lengthStandards(props) !== lengthStandards(nextProps)
  )),
)(TypeList);
