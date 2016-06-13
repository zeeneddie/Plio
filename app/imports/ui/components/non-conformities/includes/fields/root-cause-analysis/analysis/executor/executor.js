import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.NCRCAExecutor.viewmodel({
  mixin: ['members', 'search', 'user'],
  executor: '',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected:executor } = viewmodel.getData();

    if (executor === this.templateInstance.data.executor) return;

    this.executor(executor);

    this.parent().update({ 'analysis.executor': executor });
  },
  getData() {
    const { executor } = this.data();
    return { executor };
  }
});
