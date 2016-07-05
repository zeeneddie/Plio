import { Template } from 'meteor/templating';

Template.Subcards_TreatmentPlan_Edit.viewmodel({
  mixin: 'utils',
  autorun() {
    this.load(this.treatmentPlan());
  },
  treatmentPlan: '',
  comments: '',
  prevLossExp: '',
  priority: '',
  decision: '',
  update({ ...args }, cb) {
    const _args = _.keys(args)
                    .map(key => ({ [`treatmentPlan.${key}`]: args[key] }) )
                    .reduce((prev, cur) => ({ ...prev, ...cur }));
    this.parent().update(_args, cb);
  }
});
