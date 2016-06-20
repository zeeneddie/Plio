import { Template } from 'meteor/templating';

Template.Subcards_NonConformities_Edit.viewmodel({
  mixin: ['addForm'],
  addNC() {
    this.addForm(
      'SubCardEdit',
      {
        content: 'CreateNC',
        insertFn: this.insert.bind(this)
      }
    );
  },
  insertFn() {
    return this.insert.bind(this);
  },
  insert() {
    return ViewModel.findOne('CreateNC').save();
  }
});
