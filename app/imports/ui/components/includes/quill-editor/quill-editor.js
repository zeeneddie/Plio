import { Template } from 'meteor/templating';
import Quill from 'quill';

Template.QuillEditor.viewmodel({
  onRendered() {
    this.editor(new Quill(this.templateInstance.find('.editor-container')));
    this.editor().addModule('toolbar', {
      container: this.templateInstance.find('.editor-toolbar')
    });
    this.editor().addModule('link-tooltip', true);
  },
  editor: null,
  isExpanded: false,
  toggleExpand() {
    return this.isExpanded(!this.isExpanded()) && $(this.editor().container).closest('.modal').scrollTop(0);
  },
  onUpdate() {},
  update(e) {
    this.onUpdate(e, this);
  },
  getData() {
    const html = this.editor().getHTML();
    return { html };
  }
});
