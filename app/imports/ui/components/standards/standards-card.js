import { Template } from 'meteor/templating';

Template.StandardsCard.viewmodel({
  share: 'standard',
  autorun() {
    console.log(this.selectedStandardId());
  }
});
