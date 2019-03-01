import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { DocumentTypes } from '../../../../../../share/constants';
import { sortArrayByTitlePrefix } from '../../../../../../api/helpers';
import {
  insert as insertRelation,
  remove as removeRelation,
} from '../../../../../../api/relations/methods';

Template.Fields_Standards_Edit.viewmodel({
  mixin: ['organization', 'search', 'standard'],
  isEditable: true,
  standardsIds: [],
  selected() {
    const standardsIds = Array.from(this.standardsIds() || []);
    return this._getStandardsByQuery({ _id: { $in: standardsIds } });
  },
  value() {
    return invoke(this.child('Select_Multi'), 'value');
  },
  standards() {
    const standards = this._getStandardsByQuery({
      ...this.searchObject('value', [{ name: 'title' }, { name: 'status' }]),
    }).fetch();
    return sortArrayByTitlePrefix(standards);
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selectedItemId } = viewmodel.getData();
    if (this.areIdsIncludesItemId(selectedItemId)) return;

    this.parent().parent().modal().callMethod(insertRelation, {
      rel1: {
        documentId: this._id(),
        documentType: this.documentType(),
      },
      rel2: {
        documentId: selectedItemId,
        documentType: DocumentTypes.STANDARD,
      },
    });
  },
  callUpdate(selectedItemId, selected, option) {
    if (selected.length === this.selected().count() &&
        selected.every(({ _id: itemId }) =>
          this.selected().fetch().find(({ _id }) => _id === itemId))
    ) return;

    const standardsIds = selected.map(({ _id }) => _id);

    this.standardsIds(standardsIds);

    if (!this._id) return;

    const options = {
      [`${option}`]: {
        standardsIds: selectedItemId,
      },
    };

    this.parent().update({ options });
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(viewmodel) {
    const { selectedItemId } = viewmodel.getData();

    if (!this.areIdsIncludesItemId(selectedItemId)) return;

    this.parent().parent().modal().callMethod(removeRelation, {
      rel1: { documentId: this._id() },
      rel2: { documentId: selectedItemId },
    });
  },
  areIdsIncludesItemId(selectedItemId) {
    const standardsIds = this.standardsIds() || [];
    return standardsIds.includes(selectedItemId);
  },
  getData() {
    const { standardsIds } = this.data();
    return { standardsIds };
  },
});
