import { Template } from 'meteor/templating';
import curry from 'lodash.curry';

import { inspire } from '/imports/api/helpers';

Template.Subcards_Wrapper_Add.viewmodel({
  mixin: 'addForm',
  _lText: '',
  _rText: '',
  items: '',
  renderContentOnInitial: true,
  addText: 'Add a new document',
  isEditOnly: false,
  isVisible() {
    if (this.isEditOnly()) {
      return this.items && !!this.items.length;
    }
    return true;
  },
  wrapperArgs() {
    return this.data(['_lText', '_rText', 'renderContentOnInitial', 'helpText', 'textToReplaceAddButton']);
  },
  add() {
    this.onAdd(this.addForm.bind(this));
  },
});
