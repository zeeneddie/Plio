import { Template } from 'meteor/templating';

Template.StandardSectionItem.viewmodel({
  items: [],
  isNestingLevel({ nestingLevel }, level) {
    return nestingLevel === level;
  }
});
