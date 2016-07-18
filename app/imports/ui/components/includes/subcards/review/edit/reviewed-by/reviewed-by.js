import { Template } from 'meteor/templating';

Template.Review_ReviewedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  label: 'Reviewed by',
  placeholder: 'Reviewed by',
  selectFirstIfNoSelected: false,
  reviewedBy: '',
  onUpdate() {
    return (viewmodel) => {
      const { selected:reviewedBy } = viewmodel.getData();
      this.parent().update({ reviewedBy });
    };
  }
});
