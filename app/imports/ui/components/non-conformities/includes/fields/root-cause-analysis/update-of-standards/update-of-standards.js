import { Template } from 'meteor/templating';

Template.NCUpdateOfStandards.viewmodel({
  autorun() {
    this.load(this.updateOfStandards());
  },
  updateOfStandards: '',
  executor: '',
  defaultTargetDate: '',
  targetDate: '',
  status: '',
  completedAt: '',
  completedBy: '',
  update({ query = {}, options = {}, ...args }, cb) {
    const arguments = { ...args, options, query };

    ViewModel.findOne('EditNC').update(arguments, cb);
  }
});
