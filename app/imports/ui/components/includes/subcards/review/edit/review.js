import { Template } from 'meteor/templating';

Template.Subcards_Review_Edit.viewmodel({
  autorun() {
    this.load(this.review());
  },
  label: 'Review',
  review: '',
  status: 2,
  reviewedAt: '',
  reviewedBy: '',
  comments: '',
  onUpdate() {},
  update({ ...args }, cb) {
    if (_.keys(args).every(key => this.data()[key] === args[key])) return;

    _.keys(args).forEach(key => this[key](args[key]));

    const _args = _.keys(args)
                      .map(key => ({ [`review.${key}`]: args[key] }))
                      .reduce((prev, cur) => ({ ...prev, ...cur }), {});

    this.onUpdate({ ..._args }, cb);
  },
  getData() {
    const { reviewedAt, reviewedBy, comments } = this.data();
    return { reviewedAt, reviewedBy, comments };
  }
});
