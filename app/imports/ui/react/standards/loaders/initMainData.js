import { initStandards, initSections, initTypes } from '/client/redux/actions/standardsActions';
import { getState } from '/client/redux/store';

export default function initMainData({
  dispatch,
  standards,
  unreadMessagesCountMap = {},
  standardBookSections: sections,
  standardTypes: types,
}, onData) {
  dispatch(initStandards({ types, sections, standards, unreadMessagesCountMap }));

  const newStandards = getState('standards').standards;

  dispatch(initSections({ sections, types, standards: newStandards }));

  const newSections = getState('standards').sections;

  dispatch(initTypes({ types, sections: newSections }));

  onData(null, {});
}
