import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';

import TypeList from '../../components/TypeList';
import { TYPE_UNCATEGORIZED } from '../../constants';
import {
  lengthStandards,
  propEq,
  notDeleted,
  propEqId,
  pickDeep,
} from '/imports/api/helpers';
import { getState } from '/client/redux/store';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';
import {
  openStandardByFilter,
  getSelectedAndDefaultStandardByFilter,
} from '../../helpers';

export default compose(
  connect(pickDeep(['collections.standardTypes'])),
  mapProps(({ standardTypes, ...props }) => {
    let types = standardTypes;
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

    return { ...props, types };
  }),
  lifecycle({
    componentWillMount() {
      return Meteor.defer(() => {
        const urlItemId = getState('global.urlItemId');
        const {
          containedIn,
          defaultContainedIn,
          selectedStandard,
        } = getSelectedAndDefaultStandardByFilter({
          urlItemId,
          types: this.props.types,
          filter: STANDARD_FILTER_MAP.TYPE,
        });

        // if a type contains selected standard open that type otherwise open default type collapse

        openStandardByFilter({
          selectedStandard,
          containedIn,
          defaultContainedIn,
          dispatch: this.props.dispatch,
          filter: STANDARD_FILTER_MAP.TYPE,
        });
      });
    },
  }),
)(TypeList);
