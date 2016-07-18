import { Template } from 'meteor/templating';

Template.Subcards_RiskScore.viewmodel({
  tableData: '',
  score: '',
  onScoreUpdate() {
    return ({ rowId, value }) => {
      const { score: { rowId:ri, value:v, ...rest } } = this.data();

      this.score({ rowId, value, ...rest });
    };
  },
  update({ ...args }) {
    const { score = [] } = this.data();
    _.keys(args).forEach(key => score[key] = args[key]);
    this.score(score);
  },
  getData() {
    const { score } = this.data();
    return { ...score };
  }
});
