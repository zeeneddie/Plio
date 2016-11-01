import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mapProps, compose, lifecycle } from 'recompose';
import get from 'lodash.get';

import StandardsPage from '../../components/StandardsPage';
import { lengthStandards } from '/imports/api/helpers';
import { setSections } from '/client/redux/actions/standardsActions';

const propsMapper = (props) => {
  const mapper = (section, i) => {
    const filter = standard => Object.is(section._id, standard.sectionId);
    const standards = props.standards.filter(filter);

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
  lifecycle({
    componentWillReceiveProps({ sections = [] }) {
      this.props.dispatch(setSections(sections));
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
