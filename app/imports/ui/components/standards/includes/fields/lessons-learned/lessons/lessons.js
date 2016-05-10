import { Template } from 'meteor/templating';

Template.ESLessons.viewmodel({
  mixin: 'collapse',
  save() {
    
  },
  delete() {
    return Blaze.remove(this.templateInstance.view);
  }
});
