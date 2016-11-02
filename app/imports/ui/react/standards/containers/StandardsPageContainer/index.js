import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mapProps, compose, lifecycle } from 'recompose';
import get from 'lodash.get';
import { batchActions } from 'redux-batched-actions';
import { connect } from 'react-redux';

import StandardsPage from '../../components/StandardsPage';
import { lengthStandards, propEq } from '/imports/api/helpers';
import { UncategorizedTypeSection } from '/imports/api/constants';
import {
  setSections,
  setStandards,
  setTypes,
  setStandard,
  setStandardId,
  setIsCardReady,
} from '/client/redux/actions/standardsActions';
import {
  setOrg,
  setOrgId,
  setOrgSerialNumber
} from '/client/redux/actions/organizationsActions';
import {
  setFilter
} from '/client/redux/actions/globalActions';

const propsMapper = (props) => {
  const mapper = (section, i) => {
    const filter = standard => Object.is(section._id, standard.sectionId);
    const standards = props.standards
      .filter(filter)
      .map((standard) => {
        const type = props.types.find(propEq('_id', standard.typeId)) || UncategorizedTypeSection;
        return { ...standard, type };
      });

    return Object.assign({}, section, {
      standards,
      collapsed: !standards.find(({ _id }) => Object.is(_id, props.standardId))
    });
  };

  const sections = props.sections.map(mapper).filter(lengthStandards);

  return {
    ...props,
    sections
  };
};

export default compose(
  mapProps(propsMapper),
  connect(),
  lifecycle({
    componentWillReceiveProps(props) {
      const actions = [
        setOrg(props.organization),
        setOrgId(props.organizationId),
        setOrgSerialNumber(props.serialNumber),
        setTypes(props.types),
        setStandards(props.standards),
        setStandard(props.standard),
        setStandardId(props.standardId),
        setIsCardReady(props.isCardReady),
        setFilter(props.filter),
        setSections(props.sections)
      ];

      props.dispatch(batchActions(actions));
    },

    componentWillMount() {
      if (FlowRouter.getRouteName() !== 'standard') {
        const { orgSerialNumber } = this.props;

        FlowRouter.go('standard', {
          orgSerialNumber,
          standardId: get(this.props, 'sections[0].standards[0]._id')
        });
      }
    }
  })
)(StandardsPage);
