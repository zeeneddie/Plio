import { Template } from 'meteor/templating';
import Quill from 'quill';

Template.QuillEditor.viewmodel({
  editor: null,
  isExpanded: false,
  toggleExpand() {
    return this.isExpanded(!this.isExpanded()) && $(this.editor().container).closest('.modal').scrollTop(0);
  },
  onRendered() {
    this.editor(new Quill(this.templateInstance.find('.editor-container')));
    this.editor().addModule('toolbar', {
      container: this.templateInstance.find('.editor-toolbar')
    });
    this.editor().addModule('link-tooltip', true);
  }
});
