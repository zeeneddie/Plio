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

export const observeStandards = (dispatch, query, options) => {
  const handle = Standards.find(query, options).observeChanges({
    added(_id, fields) {
      if (handle) {
        console.log('added');
        dispatch(addStandard({ _id, ...fields }));
      }
    },
    changed(_id, fields) {
      console.log('changed');
      dispatch(updateStandard({ _id, ...fields }));
    },
    removed(_id) {
      console.log('removed');
      dispatch(removeStandard(_id));
    },
  });

  return handle;
};

export const observeStandardBookSections = (dispatch, query, options) => {
  const handle = StandardsBookSections.find(query, options).observeChanges({
    added(_id, fields) {
      if (handle) {
        console.log('added');
        dispatch(addStandardBookSection({ _id, ...fields }));
      }
    },
    changed(_id, fields) {
      console.log('changed');
      dispatch(updateStandardBookSection({ _id, ...fields }));
    },
    removed(_id) {
      console.log('removed');
      dispatch(removeStandardBookSection(_id));
    },
  });

  return handle;
};

export const observeStandardTypes = (dispatch, query, options) => {
  const handle = StandardTypes.find(query, options).observeChanges({
    added(_id, fields) {
      if (handle) {
        console.log('added');
        dispatch(addStandardType({ _id, ...fields }));
      }
    },
    changed(_id, fields) {
      console.log('changed');
      dispatch(updateStandardType({ _id, ...fields }));
    },
    removed(_id) {
      console.log('removed');
      dispatch(removeStandardType(_id));
    },
  });

  return handle;
};
