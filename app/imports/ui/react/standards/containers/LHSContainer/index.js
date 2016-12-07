import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, withProps, shouldUpdate } from 'recompose';

import StandardsLHS from '../../components/LHS';
import {
  onSectionToggleCollapse,
  onTypeToggleCollapse,
  onSearchTextChange,
  onClear,
  onModalOpen,
} from './handlers';
import { initSections, initTypes, initStandards } from '/client/redux/lib/standardsHelpers';
import { getStandardsByFilter } from '../../helpers';

const mapStateToProps = ({
  standards: { standardsFiltered },
  global: {
    searchText,
    filter,
    animating,
    urlItemId,
  },
  collections: {
    standards,
    // standardBookSections: sections,
    // standardTypes: types,
  },
}) => ({
  standardsFiltered,
  searchText,
  filter,
  animating,
  urlItemId,
  standards,
  // sections,
  // types,
});

export default compose(
  connect(mapStateToProps),
  shouldUpdate((props, nextProps) => !!(
    props.searchText !== nextProps.searchText ||
    props.filter !== nextProps.filter ||
    props.animating !== nextProps.animating ||
    props.standards.length !== nextProps.standards.length ||
    console.log(props.standards.length, nextProps.standards.length)
  )),
  withProps(props => ({ collapseOnSearch: props.filter !== 3 })),
  withHandlers({
    onSectionToggleCollapse,
    onTypeToggleCollapse,
    onClear,
    onModalOpen,
    onSearchTextChange: props => e => onSearchTextChange(props, e.target),
  }),
  mapProps((props) => {
    let standards = props.searchText
      ? props.standards.filter(standard => props.standardsFiltered.includes(standard._id))
      : props.standards;
    standards = getStandardsByFilter({ standards, filter: props.filter });
    return {
      ...props,
      standards,
    };
    // const p1 = performance.now();
    // const { standards: standardsRaw, sections: sectionsRaw, types: typesRaw } = props;
    // let standards = initStandards({
    //   standards: standardsRaw,
    //   sections: sectionsRaw,
    //   types: typesRaw,
    // });
    // standards = props.searchText
    //   ? standards.filter(standard => props.standardsFiltered.includes(standard._id))
    //   : standards;
    // standards = getStandardsByFilter({ standards, filter: props.filter });
    //
    // const sections = initSections({ standards, sections: sectionsRaw, types: typesRaw });
    // const types = initTypes({ sections, types: typesRaw });
    //
    // console.log('lhs performance: ', performance.now() - p1);
    //
    // return {
    //   ...props,
    //   standards,
    //   sections,
    //   types,
    //   searchResultsText: props.searchText
    //     ? `${standards.length} matching results`
    //     : '',
    // };
  }),
)(StandardsLHS);
