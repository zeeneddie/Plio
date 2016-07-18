import { Template } from 'meteor/templating';

Template.Review_LastReviewed.viewmodel({
  label: 'Last reviewed',
  placeholder: 'Last reviewed',
  reviewedAt: '',
  defaultDate: false,
  enabled: true,
  onUpdate() {
    return (viewmodel) => {
      const { date:reviewedAt } = viewmodel.getData();
      this.parent().update({ reviewedAt });
    };
  }
});
