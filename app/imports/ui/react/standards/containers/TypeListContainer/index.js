import { compose, shouldUpdate } from 'recompose';
import { connect } from 'react-redux';

import { TYPE_UNCATEGORIZED } from '../../constants';
import { lengthStandards, lengthTypes, propEq, notDeleted, propEqId } from '/imports/api/helpers';
import TypeList from '../../components/TypeList';

export default compose(
  shouldUpdate((props, nextProps) => !!(lengthStandards(props) !== lengthStandards(nextProps))),
  connect((state, props) => {
    let types = state.collections.standardTypes;
    const standards = props.standards.filter(notDeleted);
    const uncategorized = {
      _id: TYPE_UNCATEGORIZED,
      title: 'Uncategorized',
      standards: standards.filter(standard => !types.find(propEqId(standard.typeId))),
    };

    // add own standards to each type
    types = types.map(type => ({
      ...type,
      standards: standards.filter(propEq('typeId', type._id)),
    }));

    // add uncategorized type
    types = types.concat(uncategorized);

    types = types.filter(lengthStandards);

    return { types };
  }),
  shouldUpdate((props, nextProps) => !!(
    lengthTypes(props) !== lengthTypes(nextProps) ||
    lengthStandards(props) !== lengthStandards(nextProps)
  )),
)(TypeList);
