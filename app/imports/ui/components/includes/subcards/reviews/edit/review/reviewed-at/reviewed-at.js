import { Template } from 'meteor/templating';

Template.Review_ReviewedAt.viewmodel({
  label: 'Actual review date',
  placeholder: 'Actual review date',
  reviewedAt: '',
  defaultDate: false,
  enabled: true,
  onUpdate() {
    return (viewmodel) => {
      const { date: reviewedAt } = viewmodel.getData();
      this.parent().update({ reviewedAt });
    };
  },
});
