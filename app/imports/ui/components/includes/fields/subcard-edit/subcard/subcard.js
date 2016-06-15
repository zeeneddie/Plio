import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.SubCardEdit.viewmodel({
  mixin: 'collapse',
  onRendered() {
    if (!this._id) {
      this.toggleCollapse();
    }
  },
  _lText: '',
  _rText: '',
  content: '',
  onSave() {},
  onDelete() {},
  save() {
    this.onSave(this);
  },
  delete() {
    this.onDelete(this);
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  },
  getData() {
    return this.child(this.content()).getData();
  }
});
