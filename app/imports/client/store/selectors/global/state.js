import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getSearchText = view(lenses.global.searchText);

export const getFilter = view(lenses.global.filter);

export const getAnimating = view(lenses.global.animating);

export const getUrlItemId = view(lenses.global.urlItemId);

export const getUserId = view(lenses.global.userId);

export const getIsFullScreenMode = view(lenses.global.isFullScreenMode);

export const getIsCardReady = view(lenses.global.isCardReady);

export const getDataLoading = view(lenses.global.dataLoading);

export const getCurrentUser = state => state.collections.usersByIds[state.global.userId];
