import { Template } from 'meteor/templating';

Template.Subcards_Notes_Edit.viewmodel({
  mixin: 'callWithFocusCheck',
  label: 'Notes',
  notes: '',
  isTextPresent() {
    return $(this.notes()).text();
  },
  getTextIndicator() {
    return this.isTextPresent() ? '<i class="fa fa-align-left disclosure-indicator pull-right"></i>' : '';
  },
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
