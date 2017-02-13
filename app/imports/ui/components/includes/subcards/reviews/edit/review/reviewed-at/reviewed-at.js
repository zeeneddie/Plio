import { Template } from 'meteor/templating';

Template.Review_ReviewedAt.viewmodel({
  label: 'Reviewed at',
  placeholder: 'Reviewed at',
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
