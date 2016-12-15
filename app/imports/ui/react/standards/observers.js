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
} from '/client/redux/actions/collectionsActions';
import { Standards } from '/imports/share/collections/standards';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { StandardTypes } from '/imports/share/collections/standards-types';
import { expandCollapsedStandard } from './helpers';
import { getState } from '/client/redux/store';
import { propEq, getId } from '/imports/api/helpers';
import { goToStandard } from '../helpers/routeHelpers';

export const observeStandards = (dispatch, query, options) => {
  const handle = Standards.find(query, options).observeChanges({
    added(_id, fields) {
      if (handle) {
        dispatch(addStandard({ _id, ...fields }));
        // expand the section and type that are holding a newly created standard
        expandCollapsedStandard(_id);
      }
    },
    changed(_id, fields) {
      dispatch(updateStandard({ _id, ...fields }));

      // expand the section and type that are holding selected standard
      if (fields.sectionId || fields.typeId) {
        expandCollapsedStandard(_id);
      }
    },
    removed(_id) {
      dispatch(removeStandard(_id));
      const standards = getState('collections.standards').filter(propEq('isDeleted', true));
      const urlItemId = getId(_.first(standards));
      // redirect to the first standard if the selected standard is removed
      goToStandard({ urlItemId });
    },
  });

  return handle;
};

export const observeStandardBookSections = (dispatch, query, options) => {
  const handle = StandardsBookSections.find(query, options).observeChanges({
    added(_id, fields) {
      if (handle) {
        dispatch(addStandardBookSection({ _id, ...fields }));
      }
    },
    changed(_id, fields) {
      dispatch(updateStandardBookSection({ _id, ...fields }));
    },
    removed(_id) {
      dispatch(removeStandardBookSection(_id));
    },
  });

  return handle;
};

export const observeStandardTypes = (dispatch, query, options) => {
  const handle = StandardTypes.find(query, options).observeChanges({
    added(_id, fields) {
      if (handle) {
        dispatch(addStandardType({ _id, ...fields }));
      }
    },
    changed(_id, fields) {
      dispatch(updateStandardType({ _id, ...fields }));
    },
    removed(_id) {
      dispatch(removeStandardType(_id));
    },
  });

  return handle;
};
