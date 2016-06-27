import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Actions_CompletedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  completedBy: '',
  placeholder: 'Completed by',
  selectFirstIfNoSelected: false,
  enabled: true,
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected:completedBy } = viewmodel.getData();

    this.completedBy(completedBy);

    return this.parent().update({ completedBy });
  },
  getData() {
    return { completedBy: this.completedBy() };
  }
});
