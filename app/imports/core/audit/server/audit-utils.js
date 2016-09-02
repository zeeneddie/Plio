import Handlebars from 'handlebars';
import deepDiff from 'deep-diff';


export const ChangesKinds = {
  FIELD_ADDED: 1,
  FIELD_CHANGED: 2,
  FIELD_REMOVED: 3,
  ITEM_ADDED: 4,
  ITEM_REMOVED: 5
};

export const DocumentDiffer = {

  getDiff(newDocument, oldDocument) {
    const diffs = [];

    const {
      ITEM_ADDED, ITEM_REMOVED,
      FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED
    } = ChangesKinds;

    const getFieldName = (path) => {
      return _(path).map(field => _(field).isNumber() ? '$': field).join('.');
    };

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

    const rawArrayDiffs = _(rawDiffs).filter(diff => diff.kind === 'A');
    const rawFieldDiffs = _(rawDiffs).filter(diff => diff.kind !== 'A');

    const processedArrayFields = [];

    _(rawArrayDiffs).each((rawDiff) => {
      const { kind, path, item: { kind:itemKind } = {} } = rawDiff;

      const oldArray = getValue(oldDocument, path);
      const newArray = getValue(newDocument, path);

      let arr1, arr2, changeKind;
      if (itemKind === 'N') {
        arr1 = newArray;
        arr2 = oldArray;
        changeKind = ITEM_ADDED;
      } else if (itemKind === 'D') {
        arr1 = oldArray;
        arr2 = newArray;
        changeKind = ITEM_REMOVED;
      }

      const item = _(arr1).find(arr1Item => (
        _(arr2).find(arr2Item => _(arr2Item).isEqual(arr1Item)) === undefined
      ));

      const field = getFieldName(path);

      diffs.push({
        kind: changeKind,
        field,
        item,
        path
      });

      processedArrayFields.push(new RegExp(`^${field}\\.\\$`));
    });

    _(rawFieldDiffs).each((rawDiff) => {
      const { kind, path, lhs:oldValue, rhs:newValue } = rawDiff;

      const field = getFieldName(path);

      const isRedudant = !!processedArrayFields.find(re => re.test(field));
      if (isRedudant) {
        return;
      }

      const changesKinds = {
        N: FIELD_ADDED,
        E: FIELD_CHANGED,
        D: FIELD_REMOVED
      };

      diffs.push({
        kind: changesKinds[kind],
        field,
        oldValue,
        newValue,
        path
      });
    });

    return diffs;
  }

}

export const renderString = (tmpl, data) => {
  const compiledTemplate = Handlebars.compile(tmpl);
  const tmplData = data || {};

  return compiledTemplate(tmplData);
};
