import { Template } from 'meteor/templating';

Template.NCAnalysis.viewmodel({
  autorun() {
    this.load(this.analysis());
  },
  analysis: '',
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
