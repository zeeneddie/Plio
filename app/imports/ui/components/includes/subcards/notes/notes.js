import { Template } from 'meteor/templating';

Template.Subcards_Notes_Edit.viewmodel({
  mixin: 'callWithFocusCheck',
  label: 'Notes',
  notes: '<div></div>',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(e, viewmodel) {
    const { html:notes } = viewmodel.getData();

    if (this.templateInstance.data.notes === notes) return;

    this.notes(notes);

    this.callWithFocusCheck(e, () => this.parent().update({ notes }));
  },
  getData() {
    const notes = this.data();
    return { notes };
  }
});
