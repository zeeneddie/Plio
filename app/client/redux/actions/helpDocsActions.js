import {
  SET_IS_HELP_CARD_READY,
  SET_HELP_SECTIONS_DATA,
  SET_FILTERED_HELP_DOCS,
} from './types';

export function setIsHelpCardReady(isHelpCardReady) {
  return {
    type: SET_IS_HELP_CARD_READY,
    payload: { isHelpCardReady },
  };
}

export function setHelpSectionsData(helpSectionsData) {
  return {
    type: SET_HELP_SECTIONS_DATA,
    payload: { helpSectionsData },
  };
}

export function setFilteredHelpDocs(helpDocsFiltered) {
  return {
    type: SET_FILTERED_HELP_DOCS,
    payload: { helpDocsFiltered },
  };
}
