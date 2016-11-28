import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { _ } from 'meteor/underscore';

import { HelpSections } from '/imports/share/constants';
import { pickDeep } from '/imports/api/helpers';
import HelpsLHS from '../../components/HelpsLHS';

const HelpsLHSContainer = compose(
  connect(state => ({
    helps: state.collections.helps,
    orgSerialNumber: state.organizations.orgSerialNumber,
    searchText: state.global.searchText,
    filter: state.global.filter,
    collapsed: state.global.collapsed,
    animating: state.global.animating,
    urlItemId: state.global.urlItemId,
    userId: state.global.userId,
  })),
  withProps((props) => {
    const helpsBySection = _(HelpSections).map((name, key) => {
      const sectionHelps = props.helps.filter(help => (
        help.section === parseInt(key, 10)
      ));

      return {
        sectionName: name,
        sectionKey: key,
        helps: sectionHelps,
      };
    });

    return { sections: helpsBySection };
  })
)(HelpsLHS);

export default HelpsLHSContainer;
