import {
  compose,
  mapProps,
  branch,
  renderComponent,
  shouldUpdate,
} from 'recompose';
import { connect } from 'react-redux';
import { _ } from 'meteor/underscore';

import {
  some,
  getC,
  lengthStandards,
  notEquals,
  omitC,
  pickDeep,
} from '/imports/api/helpers';
import StandardsRHS from '../../components/RHS';
import { getStandardsByFilter } from '../../helpers';

const mapStateToProps = state => ({
  ...pickDeep([
    'standards.isFullScreenMode',
    'standards.isCardReady',
    'collections.standards',
    'global.filter',
  ])(state),
  standard: state.collections.standardsByIds[state.global.urlItemId],
});

export default compose(
  connect(mapStateToProps),
  mapProps(({
    isCardReady,
    standard,
    standards,
    filter,
    ...props,
  }) => ({
    ...props,
    standard,
    standards: getStandardsByFilter({ standards, filter }),
    isReady: !!(isCardReady && standards.length && standard),
  })),
  branch(
    lengthStandards,
    _.identity,
    renderComponent(StandardsRHS.NotFound),
  ),
  shouldUpdate((props, nextProps) => {
    const omitStandardKeys = omitC(['updatedAt']);
    return !!(
      props.isReady !== nextProps.isReady ||
      props.isFullScreenMode !== nextProps.isFullScreenMode ||
      notEquals(omitStandardKeys(props.standard), omitStandardKeys(nextProps.standard))
    );
  }),
  mapProps((props) => {
    const hasDocxAttachment = some([
      getC('source1.htmlUrl'),
      getC('source2.htmlUrl'),
    ], props.standard);

    return {
      ...props,
      hasDocxAttachment,
    };
  }),
)(StandardsRHS);
