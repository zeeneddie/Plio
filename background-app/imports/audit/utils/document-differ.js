import { _ } from 'meteor/underscore';
import deepDiff from 'deep-diff';

import { ChangesKinds } from './changes-kinds';


export default DocumentDiffer = {

  getDiff(newDocument, oldDocument) {
    const diffs = [];

    const {
      ITEM_ADDED, ITEM_REMOVED,
      FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
    } = ChangesKinds;

    const getFieldName = path => (
      path.map(field => _.isNumber(field) ? '$' : field).join('.')
    );

    const getValue = (obj, path) => {
      let val = obj;
      for (let i = 0; i < path.length; i++) {
        val = val[path[i]];
        if (val === undefined) {
          break;
        }
      }
      return val;
    };

    const rawDiffs = deepDiff.diff(oldDocument, newDocument);

    const rawArrayDiffs = rawDiffs.filter(diff => diff.kind === 'A');
    const rawFieldDiffs = rawDiffs.filter(diff => diff.kind !== 'A');

    const processedArrayFields = [];

    rawArrayDiffs.forEach((rawDiff) => {
      const { path, item: { kind: itemKind } = {} } = rawDiff;

      const oldArray = getValue(oldDocument, path);
      const newArray = getValue(newDocument, path);

      let arr1;
      let arr2;
      let changeKind;
      if (itemKind === 'N') {
        arr1 = newArray;
        arr2 = oldArray;
        changeKind = ITEM_ADDED;
      } else if (itemKind === 'D') {
        arr1 = oldArray;
        arr2 = newArray;
        changeKind = ITEM_REMOVED;
      }

      const item = arr1.find(arr1Item => (
        arr2.find(arr2Item => _.isEqual(arr2Item, arr1Item)) === undefined
      ));

      const field = getFieldName(path);

      diffs.push({
        kind: changeKind,
        field,
        item,
        path,
      });

      processedArrayFields.push(new RegExp(`^${field}\\.\\$`));
    });

    rawFieldDiffs.forEach((rawDiff) => {
      const {
        kind, path, lhs: oldValue, rhs: newValue,
      } = rawDiff;

      const field = getFieldName(path);

      const isRedudant = !!processedArrayFields.find(re => re.test(field));
      if (isRedudant) {
        return;
      }

      const changesKinds = {
        N: FIELD_ADDED,
        E: FIELD_CHANGED,
        D: FIELD_REMOVED,
      };

      diffs.push({
        kind: changesKinds[kind],
        field,
        oldValue,
        newValue,
        path,
      });
    });

    return diffs;
  },

};
