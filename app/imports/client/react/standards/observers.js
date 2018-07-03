import { _ } from 'meteor/underscore';

import {
  addStandard,
  updateStandard,
  removeStandard,
  addStandardBookSection,
  updateStandardBookSection,
  removeStandardBookSection,
  addStandardType,
  updateStandardType,
  removeStandardType,
} from '/imports/client/store/actions/collectionsActions';
import { Standards } from '/imports/share/collections/standards';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { StandardTypes } from '/imports/share/collections/standards-types';
import { getState } from '/imports/client/store';
import { propEq, getId, createStoreMutationObserver } from '../../../api/helpers';
import { expandCollapsedStandard } from './helpers';
import { goTo } from '../../../ui/utils/router/actions';

export const observeStandards = createStoreMutationObserver(
  dispatch => ({
    added(_id, fields) {
      dispatch(addStandard({ _id, ...fields }));

      if (fields.createdBy === getState('global.userId')) {
        // expand the section and type that are holding a newly created standard
        expandCollapsedStandard(_id);
      }
    },
    changed(_id, fields) {
      dispatch(updateStandard({ _id, ...fields }));

      // expand the section and type that are holding selected standard
      if (getState('global.urlItemId') === _id && (fields.sectionId || fields.typeId)) {
        expandCollapsedStandard(_id);
      }
    },
    removed(_id) {
      dispatch(removeStandard(_id));

      if (getState('global.urlItemId') === _id) {
        const standards = getState('collections.standards').filter(propEq('isDeleted', true));
        const urlItemId = getId(_.first(standards));
        // redirect to the first standard if the selected standard is removed
        goTo('standard')({ urlItemId });
      }
    },
  }),
  Standards,
);

export const observeStandardBookSections = createStoreMutationObserver(
  dispatch => ({
    added(_id, fields) {
      dispatch(addStandardBookSection({ _id, ...fields }));
    },
    changed(_id, fields) {
      dispatch(updateStandardBookSection({ _id, ...fields }));
    },
    removed(_id) {
      dispatch(removeStandardBookSection(_id));
    },
  }),
  StandardsBookSections,
);

export const observeStandardTypes = createStoreMutationObserver(
  dispatch => ({
    added(_id, fields) {
      dispatch(addStandardType({ _id, ...fields }));
    },
    changed(_id, fields) {
      dispatch(updateStandardType({ _id, ...fields }));
    },
    removed(_id) {
      dispatch(removeStandardType(_id));
    },
  }),
  StandardTypes,
);
