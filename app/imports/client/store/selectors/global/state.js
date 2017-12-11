import { view } from 'ramda';
import lenses from '../lenses';

export const getSearchText = view(lenses.global.searchText);

export const getFilter = view(lenses.global.filter);

export const getAnimating = view(lenses.global.animating);

export const getUrlItemId = view(lenses.global.urlItemId);

export const getUserId = view(lenses.global.userId);
