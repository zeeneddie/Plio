import { Template } from 'meteor/templating';

Template.StandardSectionItem.viewmodel({
  items: [],
  getSubNestingClassName({ nestingLevel = 1 }) {
    return 'sub'.repeat(parseInt(nestingLevel, 10) - 1);
  }
});
