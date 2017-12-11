import {
  compose,
  mapProps,
  branch,
  renderComponent,
  shouldUpdate,
} from 'recompose';
import { connect } from 'react-redux';
import { length, view, allPass, complement, identity } from 'ramda';

import {
  some,
  getC,
  notEquals,
  omitC,
  pickC,
} from '/imports/api/helpers';
import StandardsRHS from '../../components/RHS';
import { getRHSMeta } from '../../../../../client/store/selectors/standards';
import lenses from '../../../../../client/store/selectors/lenses';

const mapStateToProps = state => ({
  ...pickC(['isFullScreenMode', 'isCardReady', 'urlItemId'])(state.global),
  standard: state.collections.standardsByIds[state.global.urlItemId],
});

export default compose(
  connect(getRHSMeta),
  branch(
    compose(length, view(lenses.standards)),
    identity,
    renderComponent(StandardsRHS.NotFound),
  ),
  branch(
    allPass([
      view(lenses.searchText),
      compose(complement(length), view(lenses.standardsFiltered)),
    ]),
    renderComponent(StandardsRHS.NoResults),
    identity,
  ),
  connect(mapStateToProps),
  mapProps(({
    isCardReady,
    standard,
    standards,
    ...props
  }) => ({
    ...props,
    standard,
    isCardReady,
    isReady: !!(isCardReady && standards.length && standard),
  })),
  branch(
    props => props.isCardReady && props.urlItemId && !props.standard,
    renderComponent(StandardsRHS.NotExist),
    identity,
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
