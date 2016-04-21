import { Template } from 'meteor/templating';

Template.StandardsCard.viewmodel({
  mixin: 'standards',
  share: 'standard',
  autorun() {
    console.log(this.selectedStandardId());
  },
  standard() {
    const selectedStandard = _(this.testData()).chain().
          pluck('sub').
          flatten().
          findWhere({ _id: this.selectedStandardId() }).
          value();
    console.log(selectedStandard);
    return selectedStandard;
  }
});
